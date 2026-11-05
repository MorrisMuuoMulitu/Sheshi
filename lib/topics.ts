/**
 * Learn-page topic content, ported verbatim from legacy `topicData`
 * (index.html). English-only, matching legacy behavior — replaced by
 * bilingual Sanity `topic` documents in PLAN.md Phase 2.
 */

export type Step = { h: string; p: string };

export type Topic = {
  title: string;
  intro: string;
  steps: Step[];
  res: string;
  resD: string;
};

export const topicData: Record<string, Topic> = {
  river: {
    title: "River Cleanup Campaigns",
    intro:
      "Plan and execute an effective river restoration event — from volunteer recruitment to cleanup day.",
    steps: [
      { h: "Assess Your River", p: "Walk the river section, photograph pollution hotspots, estimate waste volume." },
      { h: "Recruit Your Team", p: "Use social media, notice boards, and schools to recruit 30+ volunteers." },
      { h: "Partner with Authorities", p: "Notify the county environment office and secure permits for public access." },
      { h: "Gather Equipment", p: "Collect gloves, bags, litter pickers, first-aid supplies. Download the Field Kit for the full list." },
      { h: "Run the Cleanup Day", p: "Brief volunteers on safety, assign zones, start. Photograph before and after." },
      { h: "Report & Celebrate", p: "Weigh collected waste, share results publicly, and thank your volunteers." },
    ],
    res: "River Cleanup Field Kit",
    resD: "Complete field kit — checklists, safety guide, volunteer briefing.",
  },
  trees: {
    title: "Urban Tree Planting",
    intro: "Restore green spaces in your city through organized community-led planting drives.",
    steps: [
      { h: "Identify Planting Sites", p: "Map degraded urban green spaces and get county approval." },
      { h: "Source Indigenous Seedlings", p: "Partner with Kenya Forest Service or local nurseries for climate-appropriate species." },
      { h: "Mobilize Partners", p: "Engage schools, churches, and businesses to co-sponsor." },
      { h: "Plan the Planting Day", p: "Assign site coordinators, brief teams on planting technique and spacing." },
      { h: "Plant and Mulch", p: "Dig holes 30cm deep, plant, water, and add mulch." },
      { h: "Set Up Aftercare Rotas", p: "Organize watering and weeding schedules for the first 3 months." },
      { h: "Document and Share", p: "GPS-tag each tree, update a public map, share progress online." },
      { h: "Annual Audit", p: "Return after 12 months to assess survival rate and plan next cycle." },
    ],
    res: "Urban Greening Toolkit",
    resD: "Site assessment forms, seedling sourcing guide, and aftercare schedule templates.",
  },
  waste: {
    title: "Waste Management",
    intro: "Build a zero-waste culture in your neighborhood using practical, community-tested tools.",
    steps: [
      { h: "Conduct a Waste Audit", p: "Survey 50 households on waste types and volumes using our audit template." },
      { h: "Run Awareness Sessions", p: "Host community meetings on waste segregation and its environmental impact." },
      { h: "Set Up Segregation Points", p: "Install clearly marked bins for organic, plastic, paper, and hazardous waste." },
      { h: "Partner with Recyclers", p: "Connect with local recycling companies or jua kali artisans." },
      { h: "Monitor & Measure", p: "Track waste volumes monthly and publish results publicly." },
    ],
    res: "Zero Waste Community Kit",
    resD: "Audit forms, segregation signage templates, and a recycler directory for Kenya.",
  },
  coastal: {
    title: "Coastal Protection",
    intro: "Monitor and protect Kenya's coastlines through organized community programs.",
    steps: [
      { h: "Map Your Coastline", p: "Document beach or mangrove health using GPS and photography." },
      { h: "Identify Key Threats", p: "Record pollution sources, erosion hotspots, and illegal fishing areas." },
      { h: "Form a Monitoring Team", p: "Train 10+ community monitors on data collection." },
      { h: "Engage KMFRI", p: "Share your data with Kenya Marine & Fisheries Research Institute." },
      { h: "Run Mangrove Restoration", p: "Partner with schools for mangrove seedling collection and replanting." },
      { h: "Advocacy Campaign", p: "Use documented evidence to advocate with county government." },
      { h: "Annual Coastal Report", p: "Publish an annual state-of-coast report to track progress." },
    ],
    res: "Coastal Monitoring Guide",
    resD: "Data collection forms, species ID sheets, and a government engagement template.",
  },
  air: {
    title: "Air Quality Advocacy",
    intro: "Measure, document, and advocate for cleaner air in your community.",
    steps: [
      { h: "Deploy Low-Cost Sensors", p: "Install PurpleAir or similar sensors at 3–5 locations." },
      { h: "Collect Baseline Data", p: "Run sensors for 4 weeks, record daily PM2.5 and PM10 readings." },
      { h: "Identify Pollution Sources", p: "Map factories, traffic routes, and waste burning sites near hotspots." },
      { h: "Engage the Community", p: "Share air quality data visually — maps, infographics — with residents and local media." },
    ],
    res: "Air Quality Advocacy Pack",
    resD: "Sensor setup guide, data visualization templates, and a media pitch template.",
  },
  energy: {
    title: "Renewable Energy",
    intro: "Introduce solar and clean energy solutions to rural and peri-urban communities.",
    steps: [
      { h: "Assess Energy Needs", p: "Survey 30 households on energy usage, cost, and current sources." },
      { h: "Identify Solar Suppliers", p: "Research KEBS-certified solar kit suppliers and compare costs." },
      { h: "Apply for Green Funding", p: "Identify county or national grants for clean energy projects." },
      { h: "Run a Demo Day", p: "Host a community demonstration of solar lanterns and solar water pumps." },
      { h: "Train Local Technicians", p: "Partner with a TVET college to train community members on installation." },
      { h: "Monitor & Scale", p: "Track energy savings and replicate the model in neighboring areas." },
    ],
    res: "Clean Energy Starter Kit",
    resD: "Needs assessment form, supplier list, funding guide, and training curriculum.",
  },
};

/** Card grid order + per-card chrome (thumb class, emoji, translated ids). */
export const topicCards: { key: string; thumb: string; icon: string; i: number; desc: string; pill: string }[] = [
  { key: "river", thumb: "th1", icon: "🏞️", i: 1, desc: "Plan and run effective river restoration events — from recruitment to cleanup day.", pill: "6 Steps" },
  { key: "trees", thumb: "th2", icon: "🌳", i: 2, desc: "Restore green spaces in your city with organized planting drives and community buy-in.", pill: "8 Steps" },
  { key: "waste", thumb: "th3", icon: "♻️", i: 3, desc: "Build a zero-waste culture in your neighborhood using practical community tools.", pill: "5 Steps" },
  { key: "coastal", thumb: "th4", icon: "🌊", i: 4, desc: "Protect Kenya's coastlines through community monitoring programs and direct action.", pill: "7 Steps" },
  { key: "air", thumb: "th5", icon: "💨", i: 5, desc: "Measure and document air pollution, then advocate for cleaner air in your area.", pill: "4 Steps" },
  { key: "energy", thumb: "th6", icon: "⚡", i: 6, desc: "Introduce solar and clean energy solutions to rural and peri-urban communities.", pill: "6 Steps" },
];
