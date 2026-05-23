import { prisma } from "@/lib/prisma";

async function main() {
  const state = await prisma.state.findFirst({ where: { abbreviation: "TX" } });
  const total = await prisma.utility.count({ where: { state_id: state!.id } });
  const openHB = await prisma.violation.findMany({
    where: {
      utility: { state_id: state!.id },
      is_health_based: true,
      resolution_date: null,
    },
    include: {
      utility: {
        select: {
          name: true, slug: true, pwsid: true,
          city_served: true, population_served: true, publish_status: true,
          website: true, phone: true, address: true,
        },
      },
    },
    orderBy: { violation_date: "desc" },
  });
  console.log("TX total utilities:", total);
  console.log("Open health-based violations:", openHB.length);
  for (const v of openHB) {
    console.log(JSON.stringify({
      utility: v.utility.name, pwsid: v.utility.pwsid, slug: v.utility.slug,
      city: v.utility.city_served, pop: v.utility.population_served, pub: v.utility.publish_status,
      website: v.utility.website, phone: v.utility.phone, address: v.utility.address,
      contaminant: v.contaminant_name, code: v.contaminant_code,
      type: v.violation_type, date: v.violation_date,
      desc: v.description, severity: v.severity, source_url: v.source_url,
    }, null, 2));
  }
  await prisma.$disconnect();
}
main();
