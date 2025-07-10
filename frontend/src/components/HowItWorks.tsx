export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Post Your Project",
      description: "Describe your project requirements and set your budget",
      icon: "📝",
    },
    {
      number: "02",
      title: "Review Proposals",
      description: "Receive proposals from skilled freelancers worldwide",
      icon: "👥",
    },
    {
      number: "03",
      title: "Work Together",
      description: "Collaborate with your chosen freelancer on the project",
      icon: "🤝",
    },
    {
      number: "04",
      title: "Pay Securely",
      description: "Release payment when you're satisfied with the work",
      icon: "💳",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Getting started is simple. Follow these easy steps to find the
            perfect freelancer for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
