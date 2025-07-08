import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600">Ready to optimize your storage? Contact us for a free consultation.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Phone" type="tel" />
                </div>
                <Input placeholder="Company" />
                <Textarea placeholder="Tell us about your project..." rows={4} />
                <Button className="bg-green-600 hover:bg-green-700 w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-green-600 font-bold">(03) 9792 0101</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-gray-600">info@saferstoragesystems.com.au</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-gray-600">
                      21 Capital Drive
                      <br />
                      Dandenong South, VIC 3175
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="text-gray-600 text-sm">
                      Office: 8am - 4:30pm
                      <br />
                      Warehouse: 6:30am - 2pm
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
