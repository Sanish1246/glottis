import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/pages/LoginForm";
import RegisterForm from "@/components/pages/RegisterForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useUser } from "../context/UserContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  BookOpen,
  MessageCircle,
  Users,
  Film,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Languages,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

const Landing = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useUser();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const splitLanguageTitle = new SplitText(".language-title", {
      type: "chars",
    });

    const languageTitle = splitLanguageTitle.chars;
    gsap.fromTo(
      ".title",
      {
        y: -150,
        opacity: 0,
      },
      {
        y: 0,
        delay: 0.35,
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
      },
    );

    gsap.fromTo(
      ".intro",
      {
        y: 150,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
        stagger: 0.5,
      },
    );
    gsap.fromTo(
      ".features",
      {
        y: -150,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        delay: 2.3,
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.3,
      },
    );
    gsap.fromTo(
      ".feature-card",
      {
        opacity: 0,
      },
      {
        scrollTrigger: ".feature-card",
        opacity: 1,
        duration: 0.9,
        stagger: 0.55,
      },
    );

    gsap.fromTo(
      languageTitle,
      {
        opacity: 0,
      },
      {
        scrollTrigger: ".language-title",
        opacity: 1,
        duration: 0.3,
        stagger: 0.07,
      },
    );

    gsap.fromTo(
      ".language-paragraph",
      {
        opacity: 0,
        x: 1000,
      },
      {
        scrollTrigger: ".language-paragraph",
        x: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.5,
      },
    );

    gsap.from(".languages", {
      scrollTrigger: ".languages",
      delay: 0.7,
      opacity: 0,
      x: 1000,
      duration: 1,
      stagger: 0.5,
    });
  }, []);

  const features = [
    {
      title: "Lessons",
      description:
        "Structured language lessons for French and Italian. Learn grammar, vocabulary, and cultural context through interactive exercises.",
      icon: GraduationCap,
      link: "/lessons",
      color: "text-blue-600",
    },
    {
      title: "Biblíon",
      description:
        "Flashcard decks for vocabulary review. Create custom decks and use spaced repetition to master new words.",
      icon: BookOpen,
      link: "/decks",
      color: "text-purple-600",
    },
    {
      title: "Athena",
      description:
        "Your AI language learning assistant. Get instant feedback, corrections, and answers to your questions. Available on WhatsApp too!",
      icon: MessageCircle,
      link: "/athena",
      color: "text-green-600",
    },
    {
      title: "Agorà",
      description:
        "Connect with other learners in our community. Practice conversations and share your language learning journey.",
      icon: Users,
      link: "/users",
      color: "text-orange-600",
    },
    {
      title: "Immersion",
      description:
        "Learn through authentic media content. Read books, watch movies, and shows in your target language with recommendations.",
      icon: Film,
      link: "/immersion",
      color: "text-red-600",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex items-center gap-3 mb-6">
          <img src="/glottis.svg" alt="Glottis" className="w-12 h-12 title" />
          <h1 className="title text-5xl md:text-7xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Glottis
          </h1>
        </div>
        <p className="intro text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4">
          Master languages through structured lessons, AI assistance, and
          immersive content
        </p>
        <p className="intro text-lg text-muted-foreground max-w-xl mb-8">
          Learn multiple languages with interactive lessons, personalized
          flashcards, and authentic media experiences
        </p>
        <div className="intro flex flex-col sm:flex-row gap-4">
          {isLoggedIn ? (
            <>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/lessons">
                  Start Learning <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8"
              >
                <Link to="/lessons">Explore Lessons</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/athena">Try Athena</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8"
                onClick={() => {
                  setIsLoginOpen(true);
                }}
              >
                Explore Lessons
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="features flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to learn languages
            </h2>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="features text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform combining structured learning, AI
            assistance, and authentic content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="feature-card hover:shadow-lg transition-shadow duration-300 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoggedIn ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link to={feature.link}>
                        Explore {feature.title}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsLoginOpen(true);
                      }}
                    >
                      Explore
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-16 px-4 bg-muted/50 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <Languages className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="language-title text-3xl md:text-4xl font-bold mb-4">
            Learn Multiple Languages
          </h2>
          <p className="language-paragraph text-lg text-muted-foreground mb-8">
            Currently supporting French and Italian, with more languages coming
            soon
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="languages px-6 py-3 bg-background rounded-lg border shadow-sm">
              <span className="text-xl font-semibold">🇫🇷 French</span>
            </div>
            <div className="languages px-6 py-3 bg-background rounded-lg border shadow-sm">
              <span className=" text-xl font-semibold">🇮🇹 Italian</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your language learning journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Glottis today and unlock a world of language learning
            possibilities
          </p>
          {!isLoggedIn && (
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => {
                setIsRegisterOpen(true);
              }}
            >
              Get Started for Free
            </Button>
          )}
        </div>
      </section>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <LoginForm
            setIsLoggedIn={setIsLoggedIn}
            setIsRegisterOpen={setIsRegisterOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent>
          <RegisterForm
            setIsLoggedIn={setIsLoggedIn}
            setIsLoginOpen={setIsLoginOpen}
            onClose={() => setIsRegisterOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
