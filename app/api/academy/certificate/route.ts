import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export const runtime = "nodejs";
const VERIFY = "https://network.coreviaholdingltd.com/academy/verify";

function safeText(value: string, max = 150) {
  return value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

async function addQr(pdf: PDFDocument, url: string) {
  try {
    const endpoint = new URL("https://api.qrserver.com/v1/create-qr-code/");
    endpoint.searchParams.set("size", "240x240");
    endpoint.searchParams.set("format", "png");
    endpoint.searchParams.set("data", url);
    endpoint.searchParams.set("color", "12352c");
    endpoint.searchParams.set("bgcolor", "ffffff");
    const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok || !(response.headers.get("content-type") || "").includes("image/png")) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length < 100 || bytes.length > 1000000) return null;
    return await pdf.embedPng(bytes);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const params = new URL(request.url).searchParams;
    const courseId = params.get("courseId") ?? "";
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const enrollment = await prisma.academyEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: { completion: true, user: { select: { name: true } } },
    });

    if (!enrollment || enrollment.status !== "COMPLETED" || !enrollment.completion) {
      return NextResponse.json({ error: "Complete all lessons and pass the assessment before downloading your certificate." }, { status: 403 });
    }

    const completion = enrollment.completion;
    const verification = new URL(VERIFY);
    verification.searchParams.set("code", completion.certificateCode);

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([842, 595]);
    const normal = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const white = rgb(1,1,1), green = rgb(0.07,0.21,0.17);
    const gold = rgb(0.73,0.60,0.32), ink = rgb(0.2,0.24,0.21);

    page.drawRectangle({ x:0, y:0, width:842, height:595, color:white });
    page.drawRectangle({ x:18, y:18, width:806, height:559, borderColor:gold, borderWidth:2.5 });
    page.drawRectangle({ x:29, y:29, width:784, height:537, borderColor:green, borderWidth:1 });

    const centered = (text:string,y:number,size:number,font=normal,color=ink) => {
      const width = font.widthOfTextAtSize(text,size);
      page.drawText(text,{x:(842-width)/2,y,size,font,color});
    };
    const centerAt = (text:string,x:number,y:number,size:number,font=normal,color=ink) => {
      page.drawText(text,{x:x-font.widthOfTextAtSize(text,size)/2,y,size,font,color});
    };
    const fit = (text:string,y:number,maxWidth:number,size:number,font=normal,color=ink) => {
      const value = safeText(text,180);
      while(size>9 && font.widthOfTextAtSize(value,size)>maxWidth) size-=0.5;
      centered(value,y,size,font,color);
    };

    centered("COREVIA RISE ACADEMY",520,19,bold,green);
    centered("CERTIFICATE OF COMPLETION",476,26,bold,green);
    centered("This certificate is proudly presented to",437,12,normal,ink);

    const learner = safeText((enrollment.user.name || "Learner").trim().toLowerCase().replace(/\b\p{L}/gu,c=>c.toUpperCase()),100);
    fit(learner || "Learner",397,720,25,bold,green);
    page.drawLine({start:{x:145,y:383},end:{x:697,y:383},thickness:1.2,color:gold});
    centered("for successfully completing the course",348,12,normal,ink);
    fit(course.title,315,700,20,bold,green);
    centered("and passing the required course assessment.",287,11,normal,ink);
    centered("Certificate No: "+completion.certificateCode,246,11,bold,green);
    centered("Issued: "+new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"long",year:"numeric",timeZone:"UTC"}).format(completion.issuedAt),222,10,normal,ink);
    centered("Issued by COREVIA HOLDINGS LTD | COREVIA RISE ACADEMY",189,10,bold,green);

    // Drawn institutional seal. It is not a claim of external accreditation.
    page.drawCircle({x:124,y:119,size:42,color:white,borderColor:gold,borderWidth:2.2});
    page.drawCircle({x:124,y:119,size:35,borderColor:green,borderWidth:1.2});
    centerAt("COREVIA RISE",124,132,6.5,bold,green);
    centerAt("ACADEMY",124,119,9,bold,green);
    centerAt("INSTITUTIONAL SEAL",124,106,5.2,bold,gold);

    // Embed only a genuine, approved signature image if one is supplied.
    let signed = false;
    try {
      const image = await readFile(path.join(process.cwd(),"public","corevia-authorized-signature.png"));
      const signature = await pdf.embedPng(image);
      page.drawImage(signature,{x:285,y:116,width:180,height:34});
      signed = true;
    } catch {}
    if (!signed) page.drawLine({start:{x:270,y:124},end:{x:510,y:124},thickness:0.9,color:green});
    centerAt("MAXWELL OKERI NYANGOYA",390,106,8,bold,green);
    centerAt("CHIEF EXECUTIVE OFFICER / DIRECTOR",390,92,7,normal,ink);
    centerAt("Authorised Signatory",390,78,7,normal,ink);

    const qr = await addQr(pdf,verification.toString());
    if (qr) {
      page.drawImage(qr,{x:678,y:83,width:76,height:76});
      page.drawText("SCAN TO VERIFY",{x:675,y:72,size:7,font:bold,color:green});
    } else {
      page.drawText("VERIFY ONLINE",{x:680,y:128,size:8,font:bold,color:green});
    }

    centered("Verify: network.coreviaholdingltd.com/academy/verify",57,7,normal,green);
    fit("Awarded in recognition of successful course completion and achievement of the required assessment standards. Celebrating learning, personal growth, and a commitment to excellence.",40,750,7.5,normal,ink);

    const bytes = await pdf.save();
    const body = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(body).set(bytes);
    return new Response(body,{status:200,headers:{
      "Content-Type":"application/pdf",
      "Content-Disposition":'attachment; filename="Corevia-Rise-Certificate-'+course.id+'.pdf"',
      "Cache-Control":"private, no-store",
      "X-Content-Type-Options":"nosniff"
    }});
  } catch (error) {
    console.error("Academy certificate error:",error);
    return NextResponse.json({error:"Unable to generate certificate."},{status:500});
  }
}