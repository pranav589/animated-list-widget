"use client";

import supabase from "@/supabaseClient";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import tailwindStyles from "../index.css?inline";

const SCROLL_SPEED = 0.25; // pixels per frame

Widget.propTypes = {
  projectId: PropTypes.number,
  leftText: PropTypes.string,
  leftSubText: PropTypes.string,
};

const leftSubTextDefault = ` Discover the remarkable client journeys that showcase our commitment
            to excellence. See how we&apos;ve transformed businesses and lives
            through our innovative solutions.`;

const leftTextDefault = `Remarkable Client Journeys`;

export default function Widget({
  projectId = 1,
  leftText = leftTextDefault,
  leftSubText = leftSubTextDefault,
}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSameDomain, setIsSameDomain] = useState(false);
  const containerRef = useRef(null);

  // Function to triple feedbacks for smooth looping
  const tripleFeedbacks = (feedbacks) => {
    return [...feedbacks, ...feedbacks, ...feedbacks];
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from("Feedback")
        .select("*")
        .eq("projectId", projectId)
        .eq("isFavorite", true);

      if (error) {
        console.error("Error fetching feedbacks", error);
      } else if (data?.length > 0) {
        const uniqueFeedbacks = Array.from(
          new Set(data.map((item) => item.id))
        ).map((id) => data.find((item) => item.id === id));

        const tripled = tripleFeedbacks(uniqueFeedbacks);
        setFeedbacks(tripled);
      }
    };

    if (projectId) {
      fetchFeedbacks();
    }
  }, [projectId]);

  // Fetch the project details from Supabase
  useEffect(() => {
    const fetchProjectDetails = async () => {
      const { data, error } = await supabase
        .from("Project")
        .select("*")
        .eq("id", projectId)
        .single(); // Use single() to fetch a single project

      if (error) {
        console.error("Error fetching project details:", error);
      } else {
        if (data?.url) {
          compareDomains(data.url, window.location.href);
        }
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const compareDomains = (projectUrl) => {
    try {
      const currentUrl = window.top.location.href;
      const projectUrlObj = new URL(projectUrl);
      const currentUrlObj = new URL(currentUrl);
      if (projectUrlObj.origin === currentUrlObj.origin) {
        setIsSameDomain(true);
      } else {
        setIsSameDomain(false);
        console.error("Domains did not match");
      }
    } catch (error) {
      console.error("Error comparing domains:", error);
      setIsSameDomain(false);
    }
  };

  // Scroll animation for single column
  useEffect(() => {
    let scrollPosition = 0;

    const animate = () => {
      if (containerRef.current) {
        const contentHeight = containerRef.current.scrollHeight;
        scrollPosition += SCROLL_SPEED;
        containerRef.current.scrollTop = scrollPosition;

        // Reset scroll position for seamless looping
        if (scrollPosition >= contentHeight / 3) {
          scrollPosition = 0;
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
  }, [feedbacks]);

  // if (!isSameDomain) {
  //   return null;
  // }

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget mx-auto container h-[700px] sm:h-[458px]">
        <div className="flex flex-col sm:flex-row items-center h-full justify-center p-2 sm:p-0">
          {/* Left-side content */}
          <div className="space-y-4 mr-8 max-w-lg mb-8 sm:mb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              {leftText}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-md">
              {leftSubText}
            </p>
          </div>

          {/* Feedback container (scrolling area) */}
          <div
            ref={containerRef}
            className="overflow-hidden h-full w-full sm:w-[50%]"
          >
            <div className="space-y-4">
              {feedbacks.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <FeedbackCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
