import { notFound } from "next/navigation"
import { InstructorDetail } from "@/components/instructor-detail"
import { instructors } from "@/lib/data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function InstructorDetailPage({ params }: PageProps) {
  const { id } = await params

  const instructor = instructors.find((i) => i.id === id)

  if (!instructor) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InstructorDetail instructor={instructor} />
      <Footer />
    </div>
  )
}
