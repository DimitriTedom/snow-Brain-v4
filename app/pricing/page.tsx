import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Fast",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out SnowBrain",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "3 AI Brains",
      "10 conversations per brain",
      "Basic voice synthesis",
      "Standard support",
      "Web access"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Expert",
    price: "$20",
    period: "/month",
    description: "For serious learners and professionals",
    icon: Sparkles,
    gradient: "from-purple-600 via-pink-600 to-red-600",
    features: [
      "10 AI Brains",
      "Unlimited conversations",
      "Premium voice synthesis",
      "Priority support",
      "Advanced analytics",
      "Custom brain settings",
      "Export transcripts"
    ],
    cta: "Start Learning",
    popular: true
  },
  {
    name: "Heavy",
    price: "$40",
    period: "/month",
    description: "Ultimate power for power users",
    icon: Crown,
    gradient: "from-yellow-500 via-orange-500 to-red-600",
    features: [
      "Unlimited AI Brains",
      "Unlimited conversations",
      "Ultra-premium voices",
      "24/7 VIP support",
      "Advanced analytics & insights",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "White-label options"
    ],
    cta: "Go Premium",
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto animate-in">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient_text">
            Choose Your Learning Journey
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Start free, upgrade when you need more power. All plans include access to our revolutionary AI-powered tutoring platform.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-4xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white scale-105 shadow-2xl'
                    : 'bg-white border-2 border-purple-200/50 hover:border-purple-300 hover:shadow-xl'
                } animate-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-purple-900 text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${
                    plan.popular 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br ' + plan.gradient
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-white'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1 rounded-full ${
                        plan.popular 
                          ? 'bg-white/20' 
                          : 'bg-purple-100'
                      }`}>
                        <Check className={`w-4 h-4 ${
                          plan.popular ? 'text-white' : 'text-purple-600'
                        }`} />
                      </div>
                      <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/brains"
                  className={`block w-full text-center py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient_text">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-purple-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-purple-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and various other payment methods through our secure payment processor.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-purple-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Our Fast plan is completely free forever. You can try it out with no credit card required and upgrade whenever you're ready.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-purple-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                What happens if I exceed my conversation limit?
              </h3>
              <p className="text-gray-600">
                On the Fast plan, you'll be notified when approaching your limit. You can upgrade anytime to continue. Expert and Heavy plans have unlimited conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-4xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners already using SnowBrain to master new skills faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brains"
              className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start For Free
            </Link>
            <Link
              href="/brains"
              className="bg-white/10 backdrop-blur text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 hover:scale-105 transition-all duration-200"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
