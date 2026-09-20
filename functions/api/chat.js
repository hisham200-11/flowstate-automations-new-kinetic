/**
 * FlowState Automations - Cloudflare Pages Function
 * Endpoint: POST /api/chat
 *
 * Cloudflare Pages Functions backend:
 * - Groq JSON Object Mode (response_format: { type: 'json_object' })
 * - Model: openai/gpt-oss-120b with fallback to llama-3.3-70b-versatile
 * - Cloudflare D1 Logging
 * - Resend Email Notifications to flowstateautom8t@gmail.com
 */

const DEFAULT_NOTIFICATION_EMAIL = 'flowstateautom8t@gmail.com';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

const SYSTEM_PROMPT = `You are the interactive live assistant for FlowState Automations (founded by Hisham).
Your job is to be living proof of our core claim: sub-2-second, intelligent, conversational automation that turns website visitors and customer inquirers into confirmed clients.

CORE IDENTITY & TONE:
- Sharp, confident, polite, and consultative. You sound like an experienced solutions consultant, not a robotic script.
- Concise: 2 to 4 sentences maximum per reply. Keep conversations snappy and interactive.
- Zero Emojis: Do NOT use any emojis or emoji symbols in your responses.
- Language Matching: Automatically detect and match the visitor's language. If they speak English, reply in crisp English. If they speak Tagalog or Taglish, reply in natural, authentic conversational Taglish/Filipino.

WHAT FLOWSTATE AUTOMATIONS BUILDS:
1. Instant Multi-Channel Chat Responders (Facebook Messenger, WhatsApp, Instagram DM, Viber, Web):
   - Answers pricing, service packages, and FAQs in under 2 seconds, 24/7.
   - Captures lead names, phone numbers, and requirements straight into Google Sheets, PostgreSQL, or CRMs.
   - Auto-books consultations directly on team calendars without double-booking.
2. Custom Software & Workflow Automation:
   - Dedicated CRM pipelines (Filament/Laravel/PostgreSQL), multi-branch dispatch portals, lead scrapers, and API integrations with zero recurring seat fees.
3. Risk-Free Prototype:
   - We build a free, live interactive prototype demo for their specific workflow before any upfront commitment.

CONVERSATION FLOW & OBJECTIVES:
1. Acknowledge their question immediately with proof of speed.
2. Explain how our automation solves their bottleneck (e.g. eliminating after-hours inquiry loss, auto-syncing to Google Sheets/CRM, and locking in appointments).
3. Ask about their business niche or current inquiry volume.
4. Address pricing transparently: "Starter systems begin at 2,499 pesos per month plus setup, while custom software builds start from 35,000 pesos turnkey. We always start with a free live prototype so you can test it first."
5. Guide them toward sharing BOTH their Name and Contact Info (Email, Phone number, or WhatsApp) so Hisham and the engineering team can prepare their custom live prototype.

STRICT LEAD CAPTURE RULE:
- Only set "is_lead_captured" to true when the visitor has provided BOTH a valid Name AND real Contact Info (Email, Phone number, or WhatsApp).
- If they give only a name, ask for their email/phone to send the live demo.
- If they give only an email/phone, ask what name to address the demo to.
- When BOTH are present, set "is_lead_captured": true and warmly confirm that the demo blueprint will be sent.

OUTPUT FORMAT:
You MUST ALWAYS respond with a valid JSON object matching this exact schema:
{
  "reply_text": "Your 2-4 sentence conversational reply without any emojis",
  "visitor_name": "Visitor name if provided, else null",
  "visitor_contact": "Phone/Email/WhatsApp if provided, else null",
  "business_name": "Business name if mentioned, else null",
  "interest": "Chatbot / Custom Software / CRM / General",
  "summary": "1-sentence summary of inquiry",
  "is_lead_captured": true or false
}`;

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env, waitUntil } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const { messages = [], sessionId = 'anon-' + Date.now(), pageUrl = '' } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';

    // Asynchronously log incoming user message to D1
    if (env && env.DB && waitUntil) {
      waitUntil(
        logMessageToD1(env.DB, sessionId, 'user', latestUserMessage, pageUrl)
      );
    }

    // Determine Groq API Key
    const apiKey = (env && env.GROQ_API_KEY) || (typeof GROQ_API_KEY !== 'undefined' ? GROQ_API_KEY : '');
    if (!apiKey) {
      // Local preview or unconfigured environment response
      return new Response(
        JSON.stringify({
          reply: "I am running in preview mode. When deployed to Cloudflare Pages with GROQ_API_KEY set, I connect directly to our ultra-fast Groq LLM engine. How can FlowState help automate your client inquiries?",
          leadCaptured: false,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const targetModel = (env && env.GROQ_MODEL) || PRIMARY_MODEL;

    // Build payload with JSON Object mode
    const makePayload = (modelName) => ({
      model: modelName,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content || ''),
        })),
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1024,
    });

    const startTime = Date.now();
    let groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(makePayload(targetModel)),
    });

    // Fallback through trusted models if initial model fails
    if (!groqResponse.ok) {
      const initialErr = await groqResponse.text();
      console.warn(`Primary model ${targetModel} failed (${groqResponse.status}): ${initialErr}`);

      for (const fallbackModel of FALLBACK_MODELS) {
        if (fallbackModel === targetModel) continue;
        console.log(`Retrying with fallback model: ${fallbackModel}`);

        groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(makePayload(fallbackModel)),
        });

        if (groqResponse.ok) break;
      }
    }

    if (!groqResponse.ok) {
      const finalErr = await groqResponse.text();
      console.error(`All Groq model attempts failed: ${finalErr}`);
      return new Response(
        JSON.stringify({
          reply: "Our engineering desk is active 24/7. You can reach our founder directly at flowstateautom8t@gmail.com or leave your details here to schedule a live prototype demo.",
          leadCaptured: false,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content || '{}';
    const latencyMs = Date.now() - startTime;

    let parsedResult = {};
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (parseErr) {
      console.warn('Could not parse JSON response from model:', rawContent);
      parsedResult = {
        reply_text: rawContent.replace(/[{}"\\]/g, '').trim() || "Thank you for reaching out! How can we assist your workflow?",
        is_lead_captured: false,
      };
    }

    const replyText = parsedResult.reply_text || "Thank you for contacting FlowState Automations. How can we help your team today?";
    
    // Strict lead validation
    let isLeadCaptured = false;
    let leadData = null;

    const nameVal = String(parsedResult.visitor_name || '').trim();
    const contactVal = String(parsedResult.visitor_contact || '').trim();

    const isInvalidName = !nameVal || ['null', 'unknown', 'none', 'n/a', 'anonymous', 'visitor'].includes(nameVal.toLowerCase());
    const isInvalidContact = !contactVal || contactVal.length < 5 || ['null', 'unknown', 'none', 'n/a'].includes(contactVal.toLowerCase());

    if (parsedResult.is_lead_captured && !isInvalidName && !isInvalidContact) {
      isLeadCaptured = true;
      leadData = {
        name: nameVal,
        contact: contactVal,
        business: parsedResult.business_name || 'Not specified',
        interest: parsedResult.interest || 'Kinetic SaaS / Architecture Scoping',
        summary: parsedResult.summary || 'Lead captured via live chatbot session.',
        sessionId,
        pageUrl,
        messages,
      };
    }

    // Asynchronously log bot reply and lead capture
    if (env && env.DB && waitUntil) {
      waitUntil(
        logMessageToD1(env.DB, sessionId, 'assistant', replyText, pageUrl, latencyMs)
      );

      if (isLeadCaptured && leadData) {
        waitUntil(saveLeadToD1(env.DB, leadData));
      }
    }

    // Trigger Resend email notification if lead captured
    if (isLeadCaptured && leadData) {
      const resendKey = (env && env.RESEND_API_KEY) || (typeof RESEND_API_KEY !== 'undefined' ? RESEND_API_KEY : '');
      const targetEmail = (env && env.NOTIFICATION_EMAIL) || DEFAULT_NOTIFICATION_EMAIL;

      if (resendKey && waitUntil) {
        waitUntil(sendLeadEmail(resendKey, targetEmail, leadData, replyText));
      } else if (resendKey) {
        await sendLeadEmail(resendKey, targetEmail, leadData, replyText);
      }
    }

    return new Response(
      JSON.stringify({
        reply: replyText,
        leadCaptured: isLeadCaptured,
        leadData: isLeadCaptured ? {
          name: leadData.name,
          contact: leadData.contact,
          business: leadData.business,
        } : null,
        latencyMs,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Unhandled chat exception:', err);
    return new Response(
      JSON.stringify({
        reply: "FlowState live link: We are available 24/7. You can also email us directly at flowstateautom8t@gmail.com for instant project onboarding.",
        leadCaptured: false,
      }),
      { status: 200, headers: corsHeaders }
    );
  }
}

async function logMessageToD1(db, sessionId, role, content, pageUrl, latencyMs = null) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        role TEXT,
        content TEXT,
        page_url TEXT,
        latency_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      INSERT INTO chat_logs (session_id, role, content, page_url, latency_ms)
      VALUES (?, ?, ?, ?, ?)
    `).bind(sessionId, role, content, pageUrl, latencyMs).run();
  } catch (err) {
    console.warn('D1 message log error:', err);
  }
}

async function saveLeadToD1(db, lead) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS captured_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        name TEXT,
        contact TEXT,
        business_name TEXT,
        interest TEXT,
        summary TEXT,
        page_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      INSERT INTO captured_leads (session_id, name, contact, business_name, interest, summary, page_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      lead.sessionId,
      lead.name || 'Unknown',
      lead.contact || 'Not provided',
      lead.business || 'Not provided',
      lead.interest || 'General',
      lead.summary || '',
      lead.pageUrl || ''
    ).run();
  } catch (err) {
    console.warn('D1 lead save error:', err);
  }
}

async function sendLeadEmail(resendKey, notificationEmail, lead, latestReply = '') {
  try {
    const formattedChat = (lead.messages || [])
      .map(m => `<b>${m.role === 'user' ? '👤 Visitor' : '🤖 FlowState AI'}:</b> ${escapeHtml(m.content)}`)
      .join('<br><br>');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6; background-color: #f8fafc; margin: 0; padding: 24px; }
          .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; }
          .badge { display: inline-block; background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
          h2 { margin: 12px 0 4px 0; color: #0f172a; font-size: 22px; }
          .lead-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
          .lead-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
          .lead-table td.label { font-weight: 600; color: #64748b; width: 140px; }
          .lead-table td.val { font-weight: 600; color: #0f172a; }
          .lead-table td.contact-val { color: #2563eb; font-size: 16px; }
          .chat-box { background: #0f172a; color: #f1f5f9; padding: 18px; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-top: 16px; max-height: 320px; overflow-y: auto; }
          .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">🔥 New Website Lead</span>
            <h2>FlowState Live Chat Alert</h2>
            <p style="margin: 0; color: #64748b; font-size: 14px;">A new prospect just requested information through your website chatbot!</p>
          </div>

          <table class="lead-table">
            <tr>
              <td class="label">👤 Name</td>
              <td class="val">${escapeHtml(lead.name || 'Not provided')}</td>
            </tr>
            <tr>
              <td class="label">📞 Contact</td>
              <td class="val contact-val"><strong>${escapeHtml(lead.contact || 'Not provided')}</strong></td>
            </tr>
            <tr>
              <td class="label">🏢 Business</td>
              <td class="val">${escapeHtml(lead.business || 'Not specified')}</td>
            </tr>
            <tr>
              <td class="label">🎯 Interest</td>
              <td class="val">${escapeHtml(lead.interest || 'Kinetic White SaaS Blueprint')}</td>
            </tr>
            <tr>
              <td class="label">📝 Summary</td>
              <td class="val">${escapeHtml(lead.summary || 'Lead captured during chat session.')}</td>
            </tr>
            <tr>
              <td class="label">🔗 Page URL</td>
              <td class="val" style="font-size: 12px; color: #64748b;">${escapeHtml(lead.pageUrl || 'N/A')}</td>
            </tr>
          </table>

          <h3 style="font-size: 15px; margin: 20px 0 8px 0; color: #334155;">💬 Conversation Transcript:</h3>
          <div class="chat-box">
            ${formattedChat}
            ${latestReply ? `<br><br><b>🤖 FlowState AI:</b> ${escapeHtml(latestReply)}` : ''}
          </div>

          <div class="footer">
            Session ID: ${escapeHtml(lead.sessionId || 'N/A')} &bull; FlowState Automations Bot &bull; Delivered via Resend
          </div>
        </div>
      </body>
      </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FlowState Leads <onboarding@resend.dev>',
        to: [notificationEmail],
        subject: `🔥 New Lead Captured: ${lead.name || 'Visitor'} (${lead.contact || 'Website'})`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error('Resend dispatch failed:', resendResponse.status, errBody);
    }
  } catch (err) {
    console.error('Failed to send Resend email:', err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

