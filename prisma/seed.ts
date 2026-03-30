import { randomUUID } from "crypto";

import {
  LeadSource,
  LeadStatus,
  PrismaClient,
  RevisionStatus,
  Role
} from "@prisma/client";
import { hash } from "bcryptjs";

import { buildStaticPayloadForSlug } from "../lib/content/legacy-source";
import { staticPageManifest } from "../lib/content/page-manifest";

const prisma = new PrismaClient();

async function upsertUser(
  email: string,
  name: string,
  password: string,
  role: Role
) {
  return prisma.user.upsert({
    where: {
      email
    },
    update: {
      name,
      role,
      passwordHash: await hash(password, 10)
    },
    create: {
      email,
      name,
      role,
      passwordHash: await hash(password, 10)
    }
  });
}

async function seedUsers() {
  const admin = await upsertUser(
    process.env.SEED_ADMIN_EMAIL || "admin@wrhwfour.com",
    "WRHW Admin",
    process.env.SEED_ADMIN_PASSWORD || "Admin123!",
    Role.ADMIN
  );

  const editor = await upsertUser(
    process.env.SEED_EDITOR_EMAIL || "editor@wrhwfour.com",
    "WRHW Editor",
    process.env.SEED_EDITOR_PASSWORD || "Editor123!",
    Role.EDITOR
  );

  const sales = await upsertUser(
    process.env.SEED_SALES_EMAIL || "sales@wrhwfour.com",
    "WRHW Sales",
    process.env.SEED_SALES_PASSWORD || "Sales123!",
    Role.SALES
  );

  return { admin, editor, sales };
}

async function seedPages(adminId: string) {
  for (const source of staticPageManifest) {
    const payload = await buildStaticPayloadForSlug(source.slug);

    if (!payload) {
      continue;
    }

    const page = await prisma.page.upsert({
      where: {
        slug: source.slug
      },
      update: {
        title: source.title,
        pageType: source.pageType
      },
      create: {
        slug: source.slug,
        title: source.title,
        pageType: source.pageType
      }
    });

    const existingPublished = await prisma.pageRevision.findFirst({
      where: {
        pageId: page.id,
        status: RevisionStatus.PUBLISHED
      },
      orderBy: {
        revisionNumber: "desc"
      }
    });

    if (!existingPublished) {
      const revision = await prisma.pageRevision.create({
        data: {
          pageId: page.id,
          revisionNumber: 1,
          status: RevisionStatus.PUBLISHED,
          title: source.title,
          seoTitle: payload.seo.title,
          seoDescription: payload.seo.description,
          canonicalUrl: payload.seo.canonicalUrl,
          socialImageUrl: payload.seo.ogImage,
          keywords: payload.seo.keywords,
          payload,
          previewToken: randomUUID(),
          publishedAt: new Date(),
          createdById: adminId
        }
      });

      await prisma.page.update({
        where: {
          id: page.id
        },
        data: {
          currentDraftId: revision.id,
          publishedRevId: revision.id
        }
      });

      continue;
    }

    if (!page.currentDraftId || !page.publishedRevId) {
      await prisma.page.update({
        where: {
          id: page.id
        },
        data: {
          currentDraftId: page.currentDraftId || existingPublished.id,
          publishedRevId: page.publishedRevId || existingPublished.id
        }
      });
    }
  }
}

async function seedLeads(salesId: string) {
  const leadCount = await prisma.lead.count();

  if (leadCount > 0) {
    return;
  }

  const sampleLeads = [
    {
      name: "Rajesh Kumar",
      company: "Manufacturing Corp",
      phone: "+91 98765 43210",
      email: "rajesh@manufacturing.com",
      service: "Server Installation & Maintenance",
      message: "Need help with a 3-server virtualization cluster for our Pune office.",
      source: LeadSource.WEBSITE,
      status: LeadStatus.NEW
    },
    {
      name: "Priya Sharma",
      company: "FinTech Solutions",
      phone: "+91 87654 32109",
      email: "priya@fintechsol.com",
      service: "Corporate IT AMC",
      message: "Looking for a Pan-India AMC proposal for 180 workstations.",
      source: LeadSource.CONTACT_PAGE,
      status: LeadStatus.CONTACTED
    },
    {
      name: "Amit Mehta",
      company: "Logistics Group",
      phone: "+91 76543 21098",
      email: "amit@logisticsgroup.co",
      service: "Networking Solutions",
      message: "We need warehouse network redesign with VPN and failover internet.",
      source: LeadSource.WEBSITE,
      status: LeadStatus.QUALIFIED
    }
  ];

  for (const sampleLead of sampleLeads) {
    const lead = await prisma.lead.create({
      data: {
        ...sampleLead,
        assignedToId: salesId
      }
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        authorId: salesId,
        type: "seeded",
        summary: `Seeded ${lead.status.toLowerCase()} lead`,
        detail: lead.message
      }
    });
  }
}

async function main() {
  const { admin, sales } = await seedUsers();
  await seedPages(admin.id);
  await seedLeads(sales.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
