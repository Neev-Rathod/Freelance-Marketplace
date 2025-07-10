export default function BuyerStories() {
  const stories = [
    {
      name: "Sarah Johnson",
      company: "TechStartup Inc.",
      avatar: "👩‍💼",
      story:
        "Found an amazing developer who helped us launch our app in just 2 weeks. The quality exceeded our expectations!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      company: "Design Studio",
      avatar: "👨‍🎨",
      story:
        "The graphic designer created exactly what we envisioned. Professional, fast, and affordable. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      company: "Marketing Agency",
      avatar: "👩‍💻",
      story:
        "Our copywriter delivered compelling content that increased our conversion rate by 40%. Outstanding work!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See how our platform has helped businesses achieve their goals with
            talented freelancers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl mr-4">
                  {story.avatar}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{story.name}</h3>
                  <p className="text-gray-400 text-sm">{story.company}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"{story.story}"</p>
              <div className="flex">
                {[...Array(story.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
