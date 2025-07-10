export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Post up to 3 projects",
        "Basic support",
        "Standard processing",
        "Community access",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$29",
      description: "For growing businesses",
      features: [
        "Unlimited projects",
        "Priority support",
        "Fast processing",
        "Advanced analytics",
        "Featured listings",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "API access",
        "White-label solution",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 bg-gray-900" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for your business. No hidden fees, no
            surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 border ${
                plan.highlighted
                  ? "bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500 transform scale-105"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
