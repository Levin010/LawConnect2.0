const steps = [
  {
    title: '+ Create Account',
    description:
      "Create a free account to access all features. If looking for a lawyer, create a client account. If you're a certified advocate looking for clients, create an advocate account.",
  },
  {
    title: '+ Book Appointments',
    description:
      'Client users can schedule appointments with advocates on the platform. Advocate users can set their appointment times based on their availability.',
  },
  {
    title: '+ Launch Case',
    description:
      'Client users can request an advocate to represent them by sending a representation request. Once the advocate approves the request, they will be able to open the case and relay case updates to the client on the platform.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-6 bg-white">
      <h2
        className="text-3xl font-bold text-center mb-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-xl p-8 text-white text-center"
            style={{ backgroundColor: '#8B0000' }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
