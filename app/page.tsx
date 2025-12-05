import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>Secure file management system with user authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button asChild size="lg">
              <Link href="/signin">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">Protected Pages:</p>
            <div className="grid gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
