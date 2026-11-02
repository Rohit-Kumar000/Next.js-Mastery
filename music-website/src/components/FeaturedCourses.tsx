'use client'
import Link from "next/link"
import courseData from "../data/music_courses.json"
import { BackgroundGradient } from "./ui/background-gradient"

interface Course{
    id: number,
    title: string,
    slug: string,
    description: string,
    price: number,
    instructor: string,
    isFeatured: boolean,
        
}

function FeaturedCourses() {
    const featuredCourses = courseData.courses.filter((course:Course) => course.isFeatured)
  return (
    <div className="py-12 bg-gray-900">
        <div>
            <div className="text-center">
                <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">FEATURED COURSES</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Learn With the Best</p>
            </div>
        </div>
        <div className="mt-10 mx-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {featuredCourses.map((course:Course)=> (
                    <div key={course.id} className="flex justify-center">
                        <BackgroundGradient
                            className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <div className="flex grow flex-col items-center p-5 text-center sm:p-6">
                                <p className="mt-4 mb-3 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
                                    {course.title}
                                </p>

                                <p className="mb-6 grow text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    {course.description}
                                </p>

                                <Link
                                    href={`/courses/${course.slug}`}
                                    className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-lg dark:border-white/15 dark:bg-white/6 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
                                >
                                    Learn More
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                    </span>
                                </Link>
                            </div>
                        </BackgroundGradient>
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-20 flex justify-center text-center">
            <BackgroundGradient containerClassName="rounded-full" className="rounded-full bg-[#151515] px-8 py-3">
                <Link href="/courses" className="group inline-flex items-center justify-center gap-3 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:text-[#fafafe]">
                    View All Courses
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </Link>
            </BackgroundGradient>
        </div>
    </div>
  )
}

export default FeaturedCourses