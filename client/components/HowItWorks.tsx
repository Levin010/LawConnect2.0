const steps = [
  {
    title: '+ Create Account',
    description:
      "If looking for a lawyer to represent you in court proceedings, create a client account. If you're a certified advocate looking for clients, create an advocate account.",
  },
  {
    title: '+ Representation Requests',
    description:
      'Client users can ask an advocate to represent them in legal proceedings by sending a representation request. Advocate users can either accept or reject a request. Accepting a request launches a new case.',
  },
  {
    title: '+ Case Updates',
    description:
      'Once an advocate launches a case, they can post updates including documents on the case pages. The client attached to the case can view these updates, communicate with and pay their advocate through the platform.',
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
