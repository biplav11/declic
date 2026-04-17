#!/usr/bin/env node
// Seeds 8 practical guides (pages) and 2–3 news posts per news_categories row.
// Idempotent: skips any entry whose `slug` already exists in PB.

import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set.");
  process.exit(1);
}

// ---------- Practical guides (pages) ----------

const GUIDES = [
  {
    slug: "vehicle-registration-tunisia",
    name: "Registering a new vehicle",
    title: "How to register a new vehicle in Tunisia",
    content: `
      <p>Once you take delivery of a new car in Tunisia, the dealership typically handles the paperwork for registration (carte grise), but it pays to know the steps so you can follow up on progress.</p>
      <h3>Documents you'll need</h3>
      <ul>
        <li>Certificate of conformity from the manufacturer.</li>
        <li>Invoice of sale showing VAT.</li>
        <li>Technical certificate and chassis photographs.</li>
        <li>National ID card or residence permit.</li>
      </ul>
      <h3>Fees and timing</h3>
      <p>Expect registration fees based on <em>puissance fiscale</em> (fiscal horsepower) and engine size. Most dealerships deliver the final grey card within 3–6 weeks of the first provisional plate being issued. Keep the provisional (WW) plate visible in the windshield until the permanent plate arrives.</p>
    `,
  },
  {
    slug: "technical-inspection-guide",
    name: "Passing the technical inspection",
    title: "Pass your visite technique first time",
    content: `
      <p>Every car sold in Tunisia must pass a <strong>visite technique</strong> (technical inspection) periodically — every 3 years for new personal vehicles, then annually after that. A pre-check at home saves a second visit.</p>
      <h3>What inspectors focus on</h3>
      <ol>
        <li>Brakes, balance, and emergency brake hold.</li>
        <li>Suspension leaks and tire tread depth (min. 1.6 mm).</li>
        <li>Lights, indicators, horn, and reverse beeper.</li>
        <li>Exhaust emissions and smoke opacity.</li>
        <li>Seat belt condition, dashboard warning lights, windshield cracks.</li>
      </ol>
      <p>Bring the original grey card and insurance certificate. Inspection stations accept cash and card; expect to pay between 30 and 60 TND depending on the vehicle class.</p>
    `,
  },
  {
    slug: "auto-insurance-basics",
    name: "Choosing auto insurance",
    title: "Auto insurance in Tunisia — what's covered and what's not",
    content: `
      <p>Third-party liability (<em>responsabilité civile</em>) is the legal minimum. Most new-car buyers upgrade to <strong>tous risques</strong> (comprehensive) cover during the warranty period.</p>
      <h3>Typical add-ons</h3>
      <ul>
        <li><strong>Assistance 0 km</strong> — towing from home, not only from the roadside.</li>
        <li><strong>Bris de glace</strong> — glass breakage for windshields and sunroofs.</li>
        <li><strong>Protection conducteur</strong> — personal injury cover for the driver.</li>
      </ul>
      <p>Premiums are driven by vehicle value, fiscal HP, driver age, and no-claims bonus. Compare 2–3 quotes and check the deductible (<em>franchise</em>) rather than the headline price.</p>
    `,
  },
  {
    slug: "leasing-vs-buying",
    name: "Leasing vs. cash purchase",
    title: "Lease, finance, or buy outright — making the call",
    content: `
      <p>Tunisian banks offer conventional auto loans, and specialised firms (Hannibal Lease, CIL, Tunisie Leasing) run operating and financial leases. Each path has trade-offs.</p>
      <h3>Cash purchase</h3>
      <p>Lowest total cost and full ownership from day one. Good if you plan to keep the car more than 6 years.</p>
      <h3>Financial lease (LLD / LOA)</h3>
      <p>Fixed monthly fee, maintenance and sometimes insurance bundled. Useful for business owners who can expense the payments. At the end of the contract, you can hand back the car or pay a residual to own it.</p>
      <h3>Classic bank loan</h3>
      <p>You own the car, the bank holds a lien. Competitive rates for 2024 models land around 8–10% APR for qualified applicants.</p>
    `,
  },
  {
    slug: "driver-license-categories",
    name: "Understanding license categories",
    title: "Driver's license categories in Tunisia",
    content: `
      <p>The Tunisian license system is aligned with European norms. The category you need depends on weight, seating, and purpose.</p>
      <ul>
        <li><strong>B</strong> — passenger cars up to 3,500 kg, maximum 9 seats including driver. Covers almost every personal vehicle.</li>
        <li><strong>B + E</strong> — B category plus trailers above 750 kg.</li>
        <li><strong>C</strong> — trucks over 3,500 kg (not used for personal pickups).</li>
        <li><strong>A1 / A</strong> — motorcycles, with A1 capped at 125 cc.</li>
      </ul>
      <p>New drivers go through a probationary period with a reduced points balance for the first two years. Rack up infractions during this window and your license is suspended pending a refresher course.</p>
    `,
  },
  {
    slug: "importing-vehicle-tunisia",
    name: "Importing a vehicle",
    title: "Importing a used vehicle into Tunisia",
    content: `
      <p>Tunisian residents can import a used vehicle under the <em>FCR</em> (franchise customs regime) once in a lifetime, or pay full import duties. Rules change frequently — always confirm with Douane before purchase.</p>
      <h3>Key eligibility checks</h3>
      <ul>
        <li>The vehicle must be less than 7 years old from first registration.</li>
        <li>Fiscal HP cap (currently 11 CV for petrol, 9 CV for diesel under FCR).</li>
        <li>Proof of residence abroad for at least 2 consecutive years.</li>
      </ul>
      <h3>What you'll pay outside FCR</h3>
      <p>Customs duty + consumer tax + VAT can easily double the invoice price on high-displacement engines. Electric and hybrid vehicles receive partial exemptions as part of the 2024 green-mobility plan.</p>
    `,
  },
  {
    slug: "first-service-schedule",
    name: "First-service schedule for new cars",
    title: "When to take your new car back to the dealership",
    content: `
      <p>Most manufacturers require a first visit at <strong>1,000 km</strong> or 1 month, followed by regular intervals at 15,000 / 30,000 km. Skipping a service window voids the contractual warranty on the drivetrain.</p>
      <h3>What happens at the first visit</h3>
      <ul>
        <li>Engine oil and filter change.</li>
        <li>Software updates (infotainment, ADAS calibrations).</li>
        <li>Torque check on suspension components.</li>
        <li>Coolant top-up and brake fluid bleed.</li>
      </ul>
      <p>Always request the service book to be stamped after each visit — resale buyers in Tunisia scrutinise this heavily and a missing stamp knocks 10–15% off the asking price.</p>
    `,
  },
  {
    slug: "electric-vehicle-adoption",
    name: "Going electric in Tunisia",
    title: "Is an electric car right for Tunisia right now?",
    content: `
      <p>Public charging infrastructure is limited but expanding. STEG and private operators have rolled out roughly 120 public chargers between Tunis, Sousse, and Sfax, with more on the A1 corridor.</p>
      <h3>Who benefits today</h3>
      <ul>
        <li>City drivers with off-street parking for a home AC charger (7–11 kW).</li>
        <li>Fleet managers who can amortise fast-charger installation at depots.</li>
        <li>Owners of solar PV systems — 8 kWp self-consumption pairs well with a 50 kWh battery.</li>
      </ul>
      <h3>Real-world range check</h3>
      <p>Most current-generation EVs deliver 60–75% of WLTP range in Tunisian summer heat with A/C running. Plan for 400 km trips with at least one 20-minute DC stop, and keep tyre pressures at the upper end of manufacturer recommendations.</p>
    `,
  },
];

// ---------- News posts ----------

const NEWS = {
  "whats-new": [
    {
      slug: "byd-seal-u-lands-in-tunisia",
      title: "BYD Seal U arrives in Tunisia with a 500 km range variant",
      content: `
        <p>BYD's plug-in hybrid mid-size SUV is now available at the Ennakl showroom in Charguia, with deliveries beginning in late April. Tunisian buyers get two trim levels: Boost (71 kWh, FWD) and Design (87 kWh, AWD) — the latter pairing a 1.5 L turbo with dual motors for a combined 325 hp.</p>
        <p>Starting price sits at 189 900 TND for the Boost, undercutting the nearest European rivals by roughly 12%. The battery carries an eight-year / 160 000 km warranty and supports 115 kW DC fast charging.</p>
      `,
      featured: true,
      show_in_index: true,
    },
    {
      slug: "renault-kwid-e-tech-reaches-north-africa",
      title: "Renault's entry-level EV Kwid E-Tech opens orders locally",
      content: `
        <p>Order books for the Kwid E-Tech opened this week at Ennakl Automobiles, with a sub-89 000 TND launch price that positions the five-door hatch as the cheapest EV on sale in the country. Renault claims 230 km of WLTP range from a 27 kWh battery, and standard AC charging tops up overnight on a household socket.</p>
        <p>Reservations require a 5 000 TND deposit and first deliveries are slated for June. The lineup skips fast charging to keep costs down — a limitation Renault argues is acceptable for the city-centric target audience.</p>
      `,
    },
    {
      slug: "peugeot-408-plug-in-hybrid-preview",
      title: "Peugeot 408 plug-in hybrid previewed ahead of summer launch",
      content: `
        <p>Stafim unveiled the 408 PHEV to a closed group of press and fleet clients last Thursday. The fastback pairs a 1.6 L turbo with a 150 bhp electric motor for 225 bhp combined, and delivers 64 km of all-electric range on the WLTP cycle.</p>
        <p>Peugeot positions the 408 above the 308 SW in the local hierarchy, targeting executive customers who want BEV efficiency on city commutes but need petrol range for weekend trips to Hammamet.</p>
      `,
    },
  ],
  trials: [
    {
      slug: "geely-coolray-long-term-test",
      title: "Geely Coolray — 10 000 km later",
      content: `
        <p>Our long-term Coolray has now cleared 10 000 km, mostly mixed urban running with a handful of motorway blasts between Tunis and Sfax. Average consumption settled at 7.4 L/100 km, about 12% higher than the factory claim but consistent with the turbocharged 1.5 L under daily conditions.</p>
        <p>Three observations after half a year: the infotainment's native Apple CarPlay is well implemented, the ride quality firms up noticeably over 80 km/h, and cabin plastics have aged better than we expected. One return to the dealer for a loose boot-lid cable — solved under warranty in under an hour.</p>
      `,
      featured: true,
    },
    {
      slug: "mg-zs-hybrid-plus-road-test",
      title: "MG ZS Hybrid+ road test: quieter than the data suggests",
      content: `
        <p>The new full-hybrid ZS takes a relaxed approach to efficiency. On our 240 km mixed loop from La Marsa down the Côte de Corail and back, it returned 4.9 L/100 km without effort, silently swapping between electric and combustion modes even at 90 km/h on the motorway.</p>
        <p>Driving dynamics are the weak link: soft springs invite body roll, and the CVT-style e-CVT can feel detached under heavy acceleration. For family buyers prioritising fuel economy, though, few rivals at the 118 000 TND price tag match its range anxiety-free footprint.</p>
      `,
    },
  ],
  concept: [
    {
      slug: "tunisian-startup-electric-quad-concept",
      title: "Tunisian startup shows off solar-assisted electric quad concept",
      content: `
        <p>Sousse-based mobility startup Solarys unveiled its SQ-1 concept at the Industry &amp; Innovation Expo in Tunis. The two-seater rear-drive quadricycle uses a 14 kWh LFP battery and 1.1 m² of in-roof thin-film PV, which Solarys says adds up to 18 km per day under Tunisian summer light.</p>
        <p>The target audience is hospitality — hotels and resorts on the coast that ferry guests over short distances. A launch-spec prototype is pencilled in for Q1 of next year with local production in partnership with Ariana-based GreenFactory.</p>
      `,
    },
    {
      slug: "renault-emblem-showcar-lands-in-north-africa",
      title: "Renault's Emblème show-car passes through Tunis",
      content: `
        <p>Renault's low-carbon manifesto, the Emblème, landed in Tunis for a three-day technical briefing. The shooting-brake concept blends a dual-energy hydrogen range extender with a 40 kWh battery pack, giving 1 000 km of claimed range with carbon emissions five times lower than today's comparable diesel estate.</p>
        <p>Renault stresses that the Emblème is a study, not a product, but several of its under-bonnet ideas — notably the heated seat wiring extruded in recycled copper — are expected to reach series production within the next two model cycles.</p>
      `,
    },
    {
      slug: "porsche-mission-x-q-and-a",
      title: "Porsche Mission X Q&amp;A: what we learned from the engineers",
      content: `
        <p>Three engineers from Weissach flew in for a roundtable at the Porsche Tunisie flagship on Avenue Mohamed V. The conversation was less about the Mission X as a future 918-successor and more about what its 900 V architecture means for the wider Porsche range.</p>
        <p>The short version: expect the production car (whenever it arrives) to pair a lightweight carbon monocoque with semi-solid-state cells that double down on power density, but don't expect a Tunisian premiere anytime soon — right-hand-drive priority markets come first.</p>
      `,
    },
  ],
  "super-car": [
    {
      slug: "ferrari-12cilindri-first-sighting-tunisia",
      title: "Ferrari 12Cilindri spotted on Avenue Taieb Mhiri",
      content: `
        <p>Our reader Youssef caught a Ferrari 12Cilindri on test plates exiting the Blue Dolphin car-park on Avenue Taieb Mhiri last weekend. The front-mid-engine V12 grand tourer replaces the 812 Superfast and is the first naturally-aspirated V12 Ferrari to be officially sold in Tunisia since the 599 GTB.</p>
        <p>No formal order book has opened, but Maranello's local concessionaire has confirmed that a handful of long-standing clients have already secured build slots for 2026 delivery.</p>
      `,
      featured: true,
    },
    {
      slug: "lamborghini-revuelto-orderbook-closes",
      title: "Lamborghini Revuelto order book closes two years ahead",
      content: `
        <p>Sant'Agata confirmed this week that every Revuelto build slot is spoken for through the end of 2026. The plug-in-hybrid V12 is the first flagship Lambo to sell out so early in its production cycle, a pattern the brand attributes to buyers hedging against future emissions regulations.</p>
        <p>For the two Tunisian clients already on the waiting list, delivery remains on schedule for Q3 — including the elusive "Ad Personam" colour match that mirrors their existing Aventador Ultimaes.</p>
      `,
    },
  ],
  "sports-auto": [
    {
      slug: "rallye-pax-romana-results",
      title: "Rallye Pax Romana — podium lock-out for local team",
      content: `
        <p>Tunis Motor Club swept the podium at this year's Rallye Pax Romana, held over three stages between Dougga and El Kef. The overall win went to the Sami Ben Salem / Karim Mansouri pairing in a Skoda Fabia Rally2, with a scratch time of 1h 47m 13s across the 96 km of competitive sections.</p>
        <p>Behind them, a reworked Peugeot 208 Rally4 — the first to run the new AP Racing brake package in the country — secured second after a clean sweep on the shakedown. Full results are published on the FTAS site.</p>
      `,
      featured: true,
    },
    {
      slug: "fim-speedway-round-announcement",
      title: "FIM speedway round confirmed for Hammamet this autumn",
      content: `
        <p>The Fédération Internationale de Motocyclisme has added the new Hammamet Speedway circuit to the 2026 calendar. The round runs 9–11 October and will host the under-21 championship finale, drawing approximately 28 riders across seven nations.</p>
        <p>Local ticketing opens in early September and circuit operators expect a full-house crowd of 18 000 across the weekend based on pre-registration numbers.</p>
      `,
    },
    {
      slug: "group-n-touring-car-series-revived",
      title: "Group N touring-car series returns to Kelibia after eight years",
      content: `
        <p>The long-dormant Group N Tunisia series is back, with its opening round staged at the newly resurfaced Kelibia circuit on a 2.6 km layout. Sixteen cars entered, ranging from Peugeot 206 RC kit cars to a pair of works-prepped BMW 330i E90s.</p>
        <p>The inaugural win went to Mehdi Khelifa in a four-generation-old Subaru Impreza WRX, proving once again that well-sorted aerodynamic tweaks can still humble fresher machinery on tight layouts.</p>
      `,
    },
  ],
  lifestyle: [
    {
      slug: "driving-the-cap-bon-loop",
      title: "Cap Bon weekend loop — the perfect 300 km Sunday",
      content: `
        <p>Leaving Tunis just after sunrise, the 300 km loop through Cap Bon covers coastline, vineyards, and the sculpted hills above El Haouaria in under seven relaxed hours — including stops for coffee in Korbous and grilled mulet in Sidi Daoud.</p>
        <p>The road surface has improved markedly since last summer's repaving campaign. Drive a sports-suspension convertible for maximum effect, and keep an eye out for the newly-opened roadside olive-oil producer just south of Soliman.</p>
      `,
      featured: true,
    },
    {
      slug: "restoring-an-r4",
      title: "Restoring a 1984 Renault 4 on a student budget",
      content: `
        <p>Nadia, a 22-year-old mechanical engineering student at INSAT, has documented an 18-month restoration of her grandfather's 1984 Renault 4 GTL. Total spend came in at 9 600 TND, including a rebuilt gearbox and a hand-stitched bench seat refresh from a tailor in Medina de Tunis.</p>
        <p>She credits the forums at auto-classique.tn for sourcing the OEM-spec headlight bezels. The finished car now doubles as both a weekend cruiser and a small-business delivery vehicle for her ceramics side-hustle.</p>
      `,
    },
  ],
};

// ---------- utilities ----------

async function findBySlug(pb, collection, slug) {
  try {
    return await pb.collection(collection).getFirstListItem(`slug = "${slug}"`, {
      requestKey: null,
    });
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

async function seedGuides(pb) {
  let created = 0, skipped = 0;
  for (const g of GUIDES) {
    const existing = await findBySlug(pb, "pages", g.slug);
    if (existing) { skipped += 1; continue; }
    await pb.collection("pages").create({
      name: g.name,
      title: g.title,
      slug: g.slug,
      content: g.content.trim(),
      published: true,
    });
    created += 1;
  }
  return { created, skipped, total: GUIDES.length };
}

async function seedNews(pb) {
  const categories = await pb.collection("news_categories").getFullList({
    fields: "id,slug,name",
    requestKey: null,
  });
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  let created = 0, skipped = 0;
  const tally = {};
  for (const [catSlug, posts] of Object.entries(NEWS)) {
    const cat = bySlug[catSlug];
    tally[catSlug] = 0;
    if (!cat) {
      console.warn(`  ⚠︎ category '${catSlug}' not found; skipping ${posts.length} posts`);
      continue;
    }
    for (const p of posts) {
      const existing = await findBySlug(pb, "news", p.slug);
      if (existing) { skipped += 1; continue; }
      await pb.collection("news").create({
        title: p.title,
        slug: p.slug,
        content: p.content.trim(),
        published: true,
        featured: !!p.featured,
        show_in_index: !!p.show_in_index,
        show_in_scroller: !!p.show_in_scroller,
        category_id: cat.id,
      });
      created += 1;
      tally[catSlug] += 1;
    }
  }
  return { created, skipped, tally };
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Authenticated against ${PB_URL}.`);

  console.log("\nSeeding practical guides (pages)…");
  const guidesResult = await seedGuides(pb);
  console.log(`  created ${guidesResult.created}, skipped ${guidesResult.skipped} (already present).`);

  console.log("\nSeeding news posts…");
  const newsResult = await seedNews(pb);
  console.log(`  created ${newsResult.created}, skipped ${newsResult.skipped}.`);
  console.log("  per-category:");
  for (const [slug, n] of Object.entries(newsResult.tally)) {
    console.log(`    ${slug.padEnd(14)} ${n}`);
  }
}

main().catch((err) => {
  console.error("fatal:", err);
  if (err?.data) console.error("details:", err.data);
  process.exit(1);
});
