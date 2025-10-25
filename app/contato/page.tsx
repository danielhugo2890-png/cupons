import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { CustomerFeedback } from "@/components/customer-feedback"

export default function ContatoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactForm />
        <CustomerFeedback />
      </main>
      <Footer />
    </div>
  )
}
