#!/usr/bin/env bash
# Re-encode every topic video to a web-friendly size and swap it in Sanity.
#
#   SANITY_API_WRITE_TOKEN=... ./scripts/reencode-videos.sh
#
# The topic videos are uploaded masters — several hundred MB each, which will
# not play on mobile data. This downloads each one, re-encodes to 720p H.264
# with a small file size, uploads the result as a new asset and repoints the
# topic document at it.
#
# The ORIGINAL asset is never deleted, so this is reversible: re-point the
# document at the old asset if the smaller file is not wanted.
#
# Requires: ffmpeg, curl, jq.
set -euo pipefail

: "${SANITY_API_WRITE_TOKEN:?set SANITY_API_WRITE_TOKEN (editor role)}"
PROJECT="${SANITY_PROJECT_ID:-i9s1a5ax}"
DATASET="${SANITY_DATASET:-production}"
API="https://${PROJECT}.api.sanity.io/v2026-11-06"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CRF="${CRF:-26}"          # lower = better/larger. 23–28 is the useful range.
HEIGHT="${HEIGHT:-720}"

echo "Fetching topic videos…"
curl -sf -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN" \
  "$API/data/query/$DATASET?query=$(python3 -c "
import urllib.parse
print(urllib.parse.quote('*[_type==\"topic\" && defined(videoFile.asset)]{_id,key,videoFile{asset->{url,size}}} | order(order asc)'))
")" > "$WORK/topics.json"

count=$(jq '.result | length' "$WORK/topics.json")
echo "  $count topic(s) with a video"

jq -r '.result[] | "\(._id)\t\(.key)\t\(.videoFile.asset.url)\t\(.videoFile.asset.size)"' "$WORK/topics.json" 2>/dev/null |
while IFS=$'\t' read -r id key url size; do
  [ -z "$url" ] && continue
  # Already small enough — nothing to do.
  if [ "$size" -lt 26214400 ]; then
    printf '· %s already %s MB, skipping\n' "$id" "$(( size / 1048576 ))"
    continue
  fi
  src="$WORK/$id.src"
  out="$WORK/$id.720.mp4"

  printf '→ %s (%s MB)\n' "$id" "$(( size / 1048576 ))"
  curl -sf -o "$src" "$url"

  # -nostdin is essential: without it ffmpeg consumes the read loop's stdin.
  ffmpeg -nostdin -y -loglevel error -i "$src" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libx264 -preset medium -crf "$CRF" \
    -c:a aac -b:a 96k \
    -movflags +faststart \
    "$out"

  before=$(( $(stat -c%s "$src") / 1048576 ))
  after=$(( $(stat -c%s "$out") / 1048576 ))

  # Upload the new master and repoint the document at it.
  asset=$(curl -sf -X POST \
    -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN" \
    -H "Content-Type: video/mp4" \
    --data-binary @"$out" \
    "$API/assets/files/$DATASET?filename=$(basename "$out")" |
    python3 -c 'import json,sys; print(json.load(sys.stdin)["document"]["_id"])')

  curl -sf -X POST -H "Authorization: Bearer $SANITY_API_WRITE_TOKEN" \
    -H "content-type: application/json" \
    -d "{\"mutations\":[{\"patch\":{\"id\":\"$id\",\"set\":{\"videoFile\":{\"_type\":\"file\",\"asset\":{\"_type\":\"reference\",\"_ref\":\"$asset\"}}}}}]}" \
    "$API/data/mutate/$DATASET" > /dev/null

  printf '  %s MB → %s MB   (%s)\n' "$before" "$after" "$asset"
  rm -f "$src" "$out"
done

echo
echo "Done. Run \`npm run audit:cms\` to confirm no file is over 25 MB."
