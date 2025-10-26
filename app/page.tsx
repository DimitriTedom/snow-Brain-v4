import BrainCard from "@/components/BrainCard";
import BrainList from "@/components/BrainList";
import Cta from "@/components/Cta";
import { getAllBrains, getRecentSessionBrains } from "@/lib/actions/brains.actions";
import { getSubjectColor } from "@/lib/utils";
import { Brain, Sparkles, Zap, Target } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  try {
    const brains = await getAllBrains({ limit: 6 });
    const recentSessionsBrains = await getRecentSessionBrains(10);
    
    return (
      <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 px-4 -mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-in">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 animate-scale-in">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI-Powered Learning Revolution</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Master Any Subject with{" "}
                  <span className="gradient_text">AI Tutors</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 text-balance">
                  Real-time voice conversations with AI tutors that adapt to your learning style. 
                  Learn faster, remember longer, and achieve your goals effortlessly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/brains"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200"
                  >
                    <Brain className="w-5 h-5" />
                    Explore Brains
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-purple-200 text-purple-600 rounded-2xl font-bold hover:bg-purple-50 hover:scale-105 transition-all duration-200"
                  >
                    View Pricing
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-purple-200/50">
                  <div>
                    <p className="text-3xl font-bold gradient_text">10K+</p>
                    <p className="text-gray-600 text-sm">Active Learners</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold gradient_text">50+</p>
                    <p className="text-gray-600 text-sm">AI Tutors</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold gradient_text">98%</p>
                    <p className="text-gray-600 text-sm">Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Right Content - Features */}
              <div className="grid grid-cols-2 gap-6 animate-in" style={{animationDelay: '200ms'}}>
                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl w-fit mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Smart AI Tutors</h3>
                  <p className="text-gray-600 text-sm">
                    Personalized learning paths tailored to your unique needs
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl w-fit mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Real-Time Voice</h3>
                  <p className="text-gray-600 text-sm">
                    Natural conversations that feel like talking to a real tutor
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl w-fit mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Adaptive Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Adjusts difficulty and pace based on your progress
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-6">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl w-fit mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Unlimited Topics</h3>
                  <p className="text-gray-600 text-sm">
                    From coding to calculus, we've got you covered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="bg-gradient-to-b from-blue-50/30 to-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient_text">Popular AI Brains</h2>
              <p className="text-xl text-gray-600">Start learning with our most loved AI tutors</p>
            </div>

            <section className="home-section">
              {brains.map((brain, index) => (
                <div key={brain.id} className="animate-in" style={{animationDelay: `${index * 50}ms`}}>
                  <BrainCard {...brain} color={getSubjectColor(brain.subject)} />
                </div>
              ))}
            </section>

            <section className="home-section mt-16">
              <BrainList title="Recently Completed Sessions" brains={recentSessionsBrains} classNames="w-2/3 max-lg:w-full"/>
              <Cta />
            </section>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return (
      <main>
        <h1 className="text-2xl underline">Popular Brains</h1>
        <div className="p-4 text-red-500">
          Error loading brains. Please check your database connection and try again.
        </div>
      </main>
    );
  }
};

export default Page;
