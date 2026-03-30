import { LeadSource } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const leadInputSchema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().min(7),
  email: z.string().trim().email(),
  service: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
  source: z.enum(["website", "contact_page", "manual"]).optional()
});

function mapLeadSource(source?: string) {
  if (source === "contact_page") {
    return LeadSource.CONTACT_PAGE;
  }

  if (source === "manual") {
    return LeadSource.MANUAL;
  }

  return LeadSource.WEBSITE;
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const payload = leadInputSchema.parse(raw);

    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        company: payload.company || null,
        phone: payload.phone,
        email: payload.email,
        service: payload.service || null,
        message: payload.message || null,
        source: mapLeadSource(payload.source)
      }
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "submitted",
        summary: `Lead submitted via ${payload.source === "contact_page" ? "contact page" : "website"}`,
        detail: payload.message || null
      }
    });

    return NextResponse.json({
      ok: true,
      message: "Thanks - our team will contact you within 2 business hours."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.issues[0]?.message ?? "Invalid lead payload."
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to save lead."
      },
      {
        status: 500
      }
    );
  }
}
