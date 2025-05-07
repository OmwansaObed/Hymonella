"use client";
import { useState } from "react";
import {
  BookOpen,
  Music,
  Heart,
  Users,
  Mail,
  ChevronDown,
  ArrowUp,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

const AboutPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      submitting: true,
      submitted: false,
      error: null,
    });

    try {
      const res = await axios.post("/api/contact", form);

      if (res.status === 200) {
        toast.success("Message sent successfully!");
        setStatus({
          submitting: false,
          submitted: true,
          error: null,
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to send message");
      setStatus({
        submitting: false,
        submitted: false,
        error: error.message || "An error occurred",
      });
    }
  };

  const resetForm = () => {
    setStatus({
      submitting: false,
      submitted: false,
      error: null,
    });
  };

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Sample FAQ data
  const faqItems = [
    {
      question: "What is the purpose of this hymn collection?",
      answer:
        "Our hymn collection aims to preserve and share timeless sacred music for worship, reflection, and spiritual growth. We believe these hymns connect us to our faith heritage while enriching contemporary worship experiences.",
    },
    {
      question: "How are hymns selected for this collection?",
      answer:
        "Hymns are carefully selected based on theological soundness, musical quality, historical significance, and usefulness in worship settings. Our editorial team reviews each hymn to ensure it meets these standards before inclusion. Not one, not 2 but many, many hymns make up our collection.",
    },
    {
      question: "Can I suggest a hymn to be added to the collection?",
      answer:
        "Yes! We welcome suggestions from our community. Please use the contact form at the bottom of this page to submit your hymn recommendations along with any information about the hymn's significance to you.",
    },
    {
      question: "How can I use these hymns in my church or organization?",
      answer:
        "Our hymns are available for personal and congregational worship. For specific licensing information regarding public performance, recordings, or publications, please reach out to our team.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "We are currently developing a mobile application to make our hymn collection even more accessible. Sign up for our newsletter to be notified when it launches.",
    },
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Omwansa Obed",
      role: "Web admin and developer",
      bio: "Omwansa Obed is the web admin and developer for our hymnal digital platform and works to make hymns accessible in modern formats.",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocLUGqnlwpLTdLwisQdg4COQLw8g4lfWuAl3B1J3ZM7yxvhQVylt=s96-c",
    },
  ];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 bg-white p-4 rounded-full shadow-md">
            <BookOpen size={60} className="mx-auto text-indigo-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            About Hymonella
          </h1>
          <p className="text-lg md:text-xl text-indigo-800 max-w-3xl mx-auto mb-8 opacity-90">
            Preserving sacred music traditions while embracing modern worship
            needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/hymns"
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md flex items-center"
            >
              <Music size={20} className="mr-2" />
              Explore Hymns
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 bg-white bg-opacity-70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-indigo-700">
              Our Mission
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-400">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="text-indigo-600" size={28} />
              </div>
              <h3 className="font-serif font-medium text-xl mb-3 text-gray-800">
                Preserve Tradition
              </h3>
              <p className="text-gray-600">
                Safeguarding the rich heritage of sacred hymns that have stood
                the test of time, connecting worshippers to their spiritual
                roots.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-400">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Music className="text-purple-600" size={28} />
              </div>
              <h3 className="font-serif font-medium text-xl mb-3 text-gray-800">
                Inspire Worship
              </h3>
              <p className="text-gray-600">
                Providing resources that elevate worship experiences through
                theologically rich and musically beautiful hymns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-pink-400">
              <div className="bg-pink-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Heart className="text-pink-600" size={28} />
              </div>
              <h3 className="font-serif font-medium text-xl mb-3 text-gray-800">
                Foster Community
              </h3>
              <p className="text-gray-600">
                Creating spaces for believers to connect through shared musical
                expressions of faith across generations and traditions.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8 rounded-xl shadow-md">
            <p className="text-indigo-800 text-lg italic leading-relaxed">
              &quot;We believe that hymns are more than just songs—they are
              vessels of theological truth, conveying deep spiritual insights
              through beautiful melodies. Our collection aims to make these
              treasures accessible to all who seek to deepen their worship
              experience.&quot;
            </p>
            <p className="mt-4 text-right text-indigo-600 font-medium">
              — The Hymnal Team
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-indigo-700">
              Our History
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-indigo-100 flex items-center justify-center p-8">
                <div className="text-center">
                  <Music size={80} className="mx-auto text-indigo-500 mb-4" />
                  <span className="text-5xl font-serif font-bold text-indigo-600">
                    2025
                  </span>
                  <p className="mt-2 text-indigo-800">Founded</p>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold mb-4 text-gray-800">
                  A Journey of Faith and Music
                </h3>
                <p className="text-gray-600 mb-4">
                  Our hymnal project began in 2025 with a small group of
                  musicians and theologians who recognized the need to preserve
                  traditional hymns while making them accessible to contemporary
                  worshippers.
                </p>
                <p className="text-gray-600 mb-4">
                  What started as a modest collection of 50 hymns has grown into
                  a comprehensive resource used by churches and individuals
                  worldwide. Through careful curation and thoughtful
                  arrangements, we&apos;ve built a bridge between rich
                  historical traditions and modern worship needs.
                </p>
                <p className="text-gray-600">
                  Today, our digital hymnal continues to grow, incorporating
                  both time-honored classics and theologically sound new
                  compositions that will inspire generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 bg-white bg-opacity-70" id="team">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-indigo-700">
              Our Team
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6"></div>
            <p className="text-lg text-indigo-800 max-w-3xl mx-auto opacity-90">
              Meet the dedicated individuals who work to preserve and share
              these timeless hymns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-4 flex justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-1 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
            >
              <Users size={18} className="mr-2" />
              Join Our Team
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-indigo-700">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6"></div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-gray-800">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-indigo-500 transition-transform ${
                      expandedFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 text-gray-600 border-t border-gray-100">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white/70" id="contact">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-indigo-700">
              Contact Us
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mb-6" />
            <p className="text-lg text-indigo-800 max-w-3xl mx-auto opacity-90">
              Have questions or suggestions? Joining our team? We&apos;d love to
              hear from you
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Contact Information Sidebar */}
              <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8">
                <div className="flex items-center mb-6">
                  <Mail className="mr-3" size={24} />
                  <h3 className="text-xl font-medium">Get In Touch</h3>
                </div>

                <div className="space-y-4">
                  <p className="flex items-start">
                    <Mail className="mr-3 mt-1 flex-shrink-0" size={18} />
                    <span>info-hymonella@gmail.com</span>
                  </p>
                  <p className="text-indigo-100 text-sm">
                    We typically respond within 1-2 business days. For urgent
                    inquiries, please include &quot;URGENT&quot; in your subject
                    line.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:w-2/3 p-8">
                {status.submitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Mail className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your message has been sent successfully. We&apos;ll get
                      back to you soon.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    {status.error && (
                      <div className="text-red-500 text-sm py-2 px-4 bg-red-50 rounded-lg">
                        {status.error}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status.submitting}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          status.submitting
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white shadow-md flex items-center justify-center`}
                      >
                        {status.submitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* Decorative footer element */}
      <div className="py-12 text-center">
        <div className="inline-block">
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
