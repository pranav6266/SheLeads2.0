import React from 'react';
import { Target, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Tailored Matching",
    description: "Smart algorithms that analyze your business stage, industry, and goals to find perfect capital fits.",
    icon: <Target className="w-6 h-6 text-rose-500" />,
    bg: "bg-rose-100",
  },
  {
    title: "AI Financial Advisor",
    description: "Instant, 24/7 eligibility analysis and document preparation powered by advanced LLMs.",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    bg: "bg-purple-100",
  },
  {
    title: "Automated Applications",
    description: "AI-generated application kits that speed up your submission and approval times by up to 5x.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    bg: "bg-yellow-100",
  },
];

const WhyUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why NariConnect?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          We bridge the gap between financial institutions and female-led innovation with a fully automated, AI-first approach.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-left p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
