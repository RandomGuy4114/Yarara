import { useMemo } from "react"
import { useParams, Link, Navigate } from "react-router"
import "../App.css"
import Topbar from "../components/Topbar"
import { marked } from "marked"
import rawDocs from "../../../Docs/Docs.md?raw"

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

export default function Docs() {
  const { slug } = useParams()

  const sections = useMemo(() => {
    const rawSections = rawDocs.split(/^## /m)

    return rawSections
      .filter((sec) => sec.trim().length > 0)
      .map((sec, index) => {
        const lines = sec.trim().split("\n")
        const isH2 = index > 0 || rawDocs.startsWith("## ")
        const title = isH2 ? lines[0].trim() : "Overview"
        const content = isH2 ? `## ${sec}` : sec

        return {
          slug: slugify(title),
          title: title,
          html: marked.parse(content)
        }
      })
  }, [])

  const currentSection = sections.find((s) => s.slug === slug)

  if (!slug && sections.length > 0) {
    return <Navigate to={`/docs/${sections[0].slug}`} replace />
  }

  return (
    <div className="docs-wrapper">
      <Topbar />

      <div className="docs-layout" style={{ display: "flex", gap: "2rem" }}>
        <nav className="docs-sidebar" style={{ width: "250px" }}>
          <h3>Documentation</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sections.map((sec) => (
              <li key={sec.slug} style={{ marginBottom: "0.5rem" }}>
                <Link
                  to={`/docs/${sec.slug}`}
                  style={{
                    textDecoration: "none",
                    fontWeight: slug === sec.slug ? "bold" : "normal",
                    color: slug === sec.slug ? "#0070f3" : "inherit"
                  }}
                >
                  {sec.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main
          className="docs-content"
          style={{ flex: 1 }}
          dangerouslySetInnerHTML={{ __html: currentSection?.html || "<h1>Page Not Found</h1>" }}
        />
      </div>
    </div>
  )
}