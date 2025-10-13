import { Archive, Building, Cog, Package } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import PaginationExample from "./custom-pagination"

export function ServicesSection() {
  const services = [
    {
      icon: Package,
      title: "Pallet Racking Systems",
      description:
        "Heavy-duty pallet racking solutions designed for maximum storage efficiency and safety compliance.",
      features: ["Selective Racking", "Drive-In Racking", "Push Back Systems", "Cantilever Racking"]
    },
    {
      icon: Building,
      title: "Mezzanine Floors",
      description: "Custom-designed mezzanine floors to maximize your warehouse space utilization.",
      features: ["Steel Construction", "Custom Design", "Building Compliance", "Quick Installation"]
    },
    {
      icon: Cog,
      title: "Warehouse Automation",
      description:
        "Advanced automation systems to streamline your warehouse operations and increase productivity.",
      features: ["Conveyor Systems", "Automated Storage", "WMS Integration", "Robotics Solutions"]
    },
    {
      icon: Archive,
      title: "Shelving Systems",
      description:
        "Versatile shelving solutions for all your storage needs, from light-duty to heavy-duty applications.",
      features: ["Longspan Shelving", "Archive Shelving", "Mobile Shelving", "Wire Shelving"]
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive storage solutions tailored to your business needs
          </p>
        </div>
        <PaginationExample />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
