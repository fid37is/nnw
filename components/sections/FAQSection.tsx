export default function FAQSection() {
    const faqs = [
        {
            question: 'How do I apply?',
            answer: 'Click the Apply button, fill out your information, and submit a short video and photos. Our team reviews and approves within 48 hours.'
        },
        {
            question: 'What are the age requirements?',
            answer: 'You must be 18 years or older to compete. Nigerian citizenship or residency is required.'
        },
        {
            question: 'How many stages are there?',
            answer: 'There are 3 competition stages: Elimination Round, Semi-Finals, and Finals. Only top performers advance.'
        },
        {
            question: 'Where can I train?',
            answer: 'Visit our Training Gyms section on the About page to find certified Ninja training locations near you.'
        },
        {
            question: 'What happens if I get eliminated?',
            answer: 'Eliminated participants are recognized on the leaderboard and can apply for the next season.'
        },
        {
            question: 'Are there prizes?',
            answer: 'Yes! Winners receive cash prizes, sponsorship deals, and the prestigious title of Naija Ninja Warrior Champion.'
        },
    ]

    return (
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-green-700/20">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-green-100 text-lg">Find answers to common questions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="group p-8 bg-green-500/10 backdrop-blur-md rounded-2xl border border-green-400/20 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-green-500/15"
                        >
                            <h3 className="font-black text-white text-lg mb-4 group-hover:text-green-300 transition-colors">
                                {faq.question}
                            </h3>
                            <p className="text-green-100 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}