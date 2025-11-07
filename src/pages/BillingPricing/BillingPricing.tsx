import React from "react";

type Plan = {
  name: string;
  description: string;
  price: string;
  buttonText: string;
  features: string[];
};

type ComparisonFeature = {
  name: string;
  values: (string | number)[];
};

type AddOn = {
  title: string;
  description: string;
  price: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "Ideal for individuals or startups new to email marketing.",
    price: "$19/month",
    buttonText: "Start Now",
    features: [
      "Email sends: 50,000/month",
      "Contact limit: 5,000",
      "Users: 1",
      "Basic automation: 3 actions",
      "Email templates included",
      "Standard reporting",
      "Community support",
      "Cancel anytime",
    ],
  },
  {
    name: "Plus",
    description: "Great for small teams seeking email and automation tools.",
    price: "$49/month",
    buttonText: "Choose Plan",
    features: [
      "Email sends: 150,000/month",
      "Contact limit: 10,000",
      "Users: 2",
      "Automation: 10 actions",
      "Basic reporting",
      "Standard support",
      "Integrations with major CRMs",
      "Custom templates",
    ],
  },
  {
    name: "Pro",
    description: "Designed for business expansion.",
    price: "$89/month",
    buttonText: "Get Started",
    features: [
      "Email sends: 500,000/month",
      "Contact limit: 50,000",
      "Users: 3",
      "Multi-step automation: 20 actions",
      "Advanced analytics",
      "A/B testing tools",
      "24/7 customer support",
      "Custom branding options",
    ],
  },
  {
    name: "Enterprise",
    description: "Run email marketing at scale with enterprise-level support.",
    price: "$145/month",
    buttonText: "Buy Now",
    features: [
      "Email sends: Unlimited",
      "Contact limit: 150,000",
      "Users: 5",
      "Multi-step automation: Unlimited",
      "Priority customer support",
      "Dedicated success manager",
      "Advanced reporting dashboard",
      "API & webhook integrations",
    ],
  },
];

const comparisonData: ComparisonFeature[] = [
  { name: "Email Sends", values: ["50k", "150k", "500k", "Unlimited"] },
  { name: "Contact Limit", values: ["5k", "10k", "50k", "150k"] },
  { name: "User Accounts", values: [1, 2, 3, 5] },
  { name: "Automation Actions", values: [3, 10, 20, "Unlimited"] },
  {
    name: "Support Type",
    values: ["Community", "Standard", "24/7", "Priority"],
  },
  {
    name: "Reports & Analytics",
    values: ["Standard", "Basic", "Advanced", "Advanced"],
  },
];

const addOns: AddOn[] = [
  {
    title: "Dedicated Account Manager",
    description: "Get one-on-one guidance and strategic planning.",
    price: "$50/month",
  },
  {
    title: "Custom Integrations",
    description:
      "Integrate with your business tools via API or custom requests.",
    price: "$75/setup",
  },
  {
    title: "Advanced Training",
    description: "Hands-on training sessions for your team.",
    price: "$120/session",
  },
];

const BillingPricing: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      {/* === Header Section === */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Autonomous Marketing Plans
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
        Choose the perfect plan tailored for your business growth. Whether
        you're a startup or an enterprise, our flexible pricing ensures you
        achieve maximum marketing efficiency.
      </p>

      {/* === Pricing Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-3xl font-bold text-gray-900">{plan.price}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mt-4 w-full">
                {plan.buttonText}
              </button>
            </div>
            <div className="p-6 border-t border-gray-200">
              <ul className="text-sm text-gray-600 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* === Feature Comparison Table === */}
      <div className="mt-16 overflow-x-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Key Features Comparison
        </h3>
        <table className="table-auto w-full border border-gray-200 text-center text-sm">
          <thead className="bg-gray-200 text-gray-800 font-semibold">
            <tr>
              <th className="border p-3">Features</th>
              {plans.map((plan) => (
                <th key={plan.name} className="border p-3">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {comparisonData.map((row, rowIndex) => (
              <tr
                key={row.name}
                className={rowIndex % 2 === 1 ? "bg-gray-50" : ""}
              >
                <td className="border p-3">{row.name}</td>
                {row.values.map((val, i) => (
                  <td key={i} className="border p-3">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Add-ons Section === */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Add-Ons and Additional Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addOns.map((addOn) => (
            <div
              key={addOn.title}
              className="bg-white rounded-xl shadow border p-6 text-center"
            >
              <h4 className="font-bold text-gray-800 mb-2">{addOn.title}</h4>
              <p className="text-gray-600 mb-3">{addOn.description}</p>
              <p className="text-blue-600 font-bold">{addOn.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* === Upgrade Plans Section === */}
      <div className="mt-16 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Upgrade?
        </h3>
        <p className="text-gray-700 max-w-xl mx-auto mb-8">
          Already on a plan? You can upgrade anytime to unlock more features,
          automation, and better performance insights.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl">
          Upgrade My Plan
        </button>
      </div>
    </div>
  );
};

export default BillingPricing;
