export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 bg-primary/20 rounded-xl mx-auto" />
        <div className="h-[600px] w-96 bg-card/50 rounded-2xl" />
      </div>
    </div>
  )
}
