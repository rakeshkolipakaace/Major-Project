import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";
import { Navigation } from "@/components/navigation";
import { AudioControls } from "@/components/audio-controls";
import { ChevronLeft, ChevronRight, Home, Volume2 } from "lucide-react";

interface StorySection {
  id: string;
  title: string;
  content: string;
  image: string;
  audioText: string;
}

const completeStory: StorySection[] = [
  {
    id: "intro",
    title: "The Purple Planet Mystery",
    content: "Luna stepped out of her shiny rocket ship and gasped. The ground beneath her feet was covered in sparkling purple crystals that made beautiful music when the wind blew through them. She had never seen anything like this in all her space travels! The mysterious planet seemed to welcome her with its cosmic symphony.",
    image: "https://images.unsplash.com/photo-1541185934-01b600ea069c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Luna stepped out of her shiny rocket ship and gasped. The ground beneath her feet was covered in sparkling purple crystals that made beautiful music when the wind blew through them."
  },
  {
    id: "discovery",
    title: "The Singing Crystals",
    content: "As Luna walked carefully across the crystal field, each step created a new musical note. The crystals responded to her presence, glowing brighter and singing in harmony. She realized that the crystals were not just beautiful decorations - they were alive! Each crystal had its own unique voice, and together they created the most beautiful music Luna had ever heard.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "As Luna walked carefully across the crystal field, each step created a new musical note. The crystals responded to her presence, glowing brighter and singing in harmony."
  },
  {
    id: "cave",
    title: "The Glowing Cave",
    content: "Following the melodic sounds, Luna found a magnificent glowing cave. The entrance was framed by the largest crystals she had ever seen, each one as tall as a tree and shimmering with rainbow colors. Inside, the crystals grew even larger and their songs grew louder, creating a symphony of cosmic music that filled her heart with wonder and excitement.",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Following the melodic sounds, Luna found a magnificent glowing cave. Inside, the crystals grew larger and their songs grew louder, creating a symphony of cosmic music."
  },
  {
    id: "symbols",
    title: "Ancient Symbols",
    content: "Deep in the cave, Luna discovered ancient symbols carved into the crystal walls. The symbols glowed with a soft, warm light that pulsed in rhythm with the crystal songs. As she traced the symbols with her finger, they began to tell a story - the story of the Crystal Singers who had lived on this planet long, long ago.",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Deep in the cave, Luna discovered ancient symbols carved into the crystal walls. The symbols glowed with a soft, warm light that pulsed in rhythm with the crystal songs."
  },
  {
    id: "revelation",
    title: "The Crystal Singers' Gift",
    content: "As Luna read the symbols aloud, the crystals began to glow brighter than ever before. The ancient story revealed that the Crystal Singers were peaceful beings who had left their planet to explore the galaxy. Before leaving, they transformed themselves into these musical crystals to share their gift of harmony with future visitors like Luna.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "As Luna read the symbols aloud, the crystals began to glow brighter than ever before. The ancient story revealed that the Crystal Singers had left their gift of harmony for future visitors."
  },
  {
    id: "learning",
    title: "Learning the Crystal Language",
    content: "Luna spent hours in the cave, learning to communicate with the crystals. She discovered that different tones and melodies could make the crystals respond in various ways. Some would light up in beautiful patterns, others would create floating geometric shapes of pure light, and some would even project holographic images of the Crystal Singers' memories.",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Luna spent hours in the cave, learning to communicate with the crystals. She discovered that different tones and melodies could make the crystals respond in various ways."
  },
  {
    id: "friendship",
    title: "A New Friendship",
    content: "The largest crystal in the center of the cave began to pulse with a warm, golden light. Luna realized this was the Heart Crystal - the leader of all the Crystal Singers. Through beautiful melodies and light patterns, the Heart Crystal welcomed Luna as a friend and invited her to become a Guardian of their musical legacy.",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "The largest crystal in the center of the cave began to pulse with a warm, golden light. The Heart Crystal welcomed Luna as a friend and Guardian of their musical legacy."
  },
  {
    id: "promise",
    title: "Luna's Promise",
    content: "Luna made a solemn promise to the Crystal Singers. She would return to Earth and share their story with everyone, teaching people about the importance of harmony, music, and friendship across the galaxy. The crystals sang a beautiful farewell melody as Luna prepared to leave, giving her a small crystal pendant to remember them by.",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Luna made a solemn promise to the Crystal Singers. She would return to Earth and share their story with everyone, teaching people about the importance of harmony and friendship."
  },
  {
    id: "journey-home",
    title: "The Journey Home",
    content: "As Luna walked back to her rocket ship, the entire crystal field lit up in a spectacular display of colors and music. Every crystal on the planet was saying goodbye, creating a symphony so beautiful that it brought tears of joy to Luna's eyes. She knew this was just the beginning of many adventures to come.",
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "As Luna walked back to her rocket ship, the entire crystal field lit up in a spectacular display of colors and music. Every crystal was saying goodbye with a beautiful symphony."
  },
  {
    id: "epilogue",
    title: "A New Mission",
    content: "Back on her ship, Luna carefully placed the crystal pendant in a special display case. As she started her engines and lifted off from the Purple Planet, she could still hear the faint echo of the Crystal Singers' farewell song. Luna smiled, knowing that she would carry their message of harmony throughout the galaxy, making new friends and discovering new wonders among the stars.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    audioText: "Back on her ship, Luna carefully placed the crystal pendant in a special display case. She would carry the Crystal Singers' message of harmony throughout the galaxy."
  }
];

export default function Storybook() {
  const [, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = scrollLeft / maxScroll;
      setScrollProgress(progress);
      
      // Calculate which section should be displayed based on scroll position
      const sectionIndex = Math.floor(progress * completeStory.length);
      const clampedIndex = Math.min(Math.max(sectionIndex, 0), completeStory.length - 1);
      setCurrentSection(clampedIndex);
    }
  };

  const scrollToSection = (direction: 'prev' | 'next') => {
    if (scrollContainerRef.current) {
      const newSection = direction === 'next' 
        ? Math.min(currentSection + 1, completeStory.length - 1)
        : Math.max(currentSection - 1, 0);
      
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetScroll = (newSection / (completeStory.length - 1)) * maxScroll;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const goHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AnimatedBackground />
      <Navigation />
      
      <div className="relative z-10 h-screen overflow-hidden">
        {/* Fixed Image Section - Left Side */}
        <div className="fixed left-0 top-0 w-1/2 h-full z-20">
          <div className="relative w-full h-full">
            <img 
              src={completeStory[currentSection].image}
              alt={completeStory[currentSection].title}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
            
            {/* Image Overlay with Title */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl font-gaming text-primary mb-2">
                {completeStory[currentSection].title}
              </h2>
              <div className="flex items-center space-x-4">
                <AudioControls 
                  text={completeStory[currentSection].audioText}
                  className="bg-black/40 backdrop-blur-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Story Content - Right Side */}
        <div className="ml-[50%] w-1/2 h-full relative">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-full overflow-x-auto overflow-y-hidden"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex h-full" style={{ width: `${completeStory.length * 100}%` }}>
              {completeStory.map((section, index) => (
                <div 
                  key={section.id}
                  className="flex-shrink-0 h-full p-8 flex flex-col justify-center"
                  style={{ 
                    width: `${100 / completeStory.length}%`,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        Chapter {index + 1} of {completeStory.length}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-gaming text-primary mb-6">
                      {section.title}
                    </h3>
                    
                    <div className="prose prose-lg text-foreground leading-relaxed">
                      <p className="text-lg leading-loose">
                        {section.content}
                      </p>
                    </div>

                    {/* Interactive Reading Section */}
                    {index % 3 === 0 && (
                      <div className="mt-8 p-4 bg-accent/10 border-l-4 border-accent rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <Volume2 className="w-5 h-5 text-accent" />
                          <span className="text-accent font-gaming text-sm">Practice Reading!</span>
                        </div>
                        <p className="text-sm italic">
                          "Try reading this part aloud: {section.audioText.split('.')[0]}."
                        </p>
                      </div>
                    )}

                    {/* Progress Indicator */}
                    <div className="mt-8">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Story Progress</span>
                        <span>{Math.round(((index + 1) / completeStory.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((index + 1) / completeStory.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-8 right-8 z-30 flex space-x-4">
          <Button
            onClick={() => scrollToSection('prev')}
            disabled={currentSection === 0}
            className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md border border-border hover:bg-card"
            data-testid="button-prev-section"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={() => scrollToSection('next')}
            disabled={currentSection === completeStory.length - 1}
            className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-md border border-border hover:bg-card"
            data-testid="button-next-section"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={goHome}
            className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary"
            data-testid="button-home"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Section Indicators */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex space-x-2 bg-card/80 backdrop-blur-md rounded-full p-3 border border-border">
            {completeStory.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSection 
                    ? 'bg-primary w-6' 
                    : index < currentSection 
                      ? 'bg-secondary' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}