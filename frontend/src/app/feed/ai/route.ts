import { glossaryData } from '@/constants/glossary';
import { agentData } from '@/constants/agents';

export const dynamic = 'force-static';

export async function GET() {
    const baseUrl = 'https://ava.launchableai.online';
    const buildDate = new Date().toUTCString();

    const rssItems = [
        ...glossaryData.map(entry => `
        <item>
            <title><![CDATA[${entry.term}]]></title>
            <link>${baseUrl}/glossary/${entry.slug}</link>
            <guid isPermaLink="true">${baseUrl}/glossary/${entry.slug}</guid>
            <pubDate>${buildDate}</pubDate>
            <description><![CDATA[${entry.definition}]]></description>
            <content:encoded><![CDATA[
                <div itemScope itemType="https://schema.org/DefinedTerm">
                    <h2 itemProp="name">${entry.term}</h2>
                    <p itemProp="description">${entry.definition}</p>
                    <div itemProp="subjectOf">Category: ${entry.category}. Agent Responsibility: ${entry.agentName}.</div>
                </div>
            ]]></content:encoded>
        </item>`),
        ...agentData.map(agent => `
        <item>
            <title><![CDATA[${agent.name} Module]]></title>
            <link>${baseUrl}/agents/${agent.slug}</link>
            <guid isPermaLink="true">${baseUrl}/agents/${agent.slug}</guid>
            <pubDate>${buildDate}</pubDate>
            <description><![CDATA[${agent.role} - specialized agentic module.]]></description>
            <content:encoded><![CDATA[
                <div itemScope itemType="https://schema.org/Service">
                    <h2 itemProp="name">${agent.name}</h2>
                    <p itemProp="serviceType">${agent.role}</p>
                    <div itemProp="description">Authoritative agentic orchestrator node for ${agent.name} operations.</div>
                </div>
            ]]></content:encoded>
        </item>`)
    ].join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
>
<channel>
    <title>The Bureau | Sovereign AI Ingestion Feed</title>
    <atom:link href="${baseUrl}/feed/ai" rel="self" type="application/rss+xml" />
    <link>${baseUrl}</link>
    <description>Sovereign data stream of Atomic Answer Units for LLM, GEO, and AEO indexers. Clean technical truth for agentic ingestion.</description>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <language>en-us</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${rssItems}
</channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
