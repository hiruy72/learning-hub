import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("password123", 10);

    // 1. Seed Admin
    const adminEmail = "admin@mentorship.com";
    console.log(`Seeding default admin: ${adminEmail}...`);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: password,
            name: "Default Admin",
            role: Role.ADMIN,
            bio: "System Administrator and platform curator.",
            imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        },
    });

    // 2. Seed Mentors
    console.log("Seeding mentors...");
    const mentor1 = await prisma.user.upsert({
        where: { email: "alex.mentor@test.com" },
        update: {},
        create: {
            email: "alex.mentor@test.com",
            password: password,
            name: "Alex Johnson",
            role: Role.MENTOR,
            department: "Computer Science",
            year: "4th Year",
            bio: "Passionate about algorithms and web development. Here to help freshers navigate the CS journey.",
            imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
        },
    });

    const mentor2 = await prisma.user.upsert({
        where: { email: "sarah.mentor@test.com" },
        update: {},
        create: {
            email: "sarah.mentor@test.com",
            password: password,
            name: "Sarah Williams",
            role: Role.MENTOR,
            department: "Electrical Engineering",
            year: "Alumni",
            bio: "Power systems expert and career guide. Let's build the future of energy together.",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        },
    });

    // 3. Seed Communities
    console.log("Seeding communities...");
    const community1 = await prisma.community.create({
        data: {
            title: "Computer Science Freshers",
            description: "A hub for code, coffee, and collaboration. Join to get help with CS 101.",
            department: "Computer Science",
            mentorId: mentor1.id,
            meetLink: "https://meet.google.com/abc-defg-hij",
        }
    });

    const community2 = await prisma.community.create({
        data: {
            title: "EE Design Masters",
            description: "Advanced circuit design and robotics projects. Exclusively for EE students.",
            department: "Electrical Engineering",
            mentorId: mentor2.id,
            meetLink: "https://meet.google.com/xyz-pqrs-tuv",
        }
    });

    const community3 = await prisma.community.create({
        data: {
            title: "Algorithm Enthusiasts",
            description: "Deep dive into LeetCode, data structures, and competitive programming.",
            department: "Engineering",
            mentorId: mentor1.id,
        }
    });

    // 4. Seed Blogs
    console.log("Seeding blogs...");
    await prisma.blog.createMany({
        data: [
            {
                title: "10 Tips for Freshers to Ace Their First Semester",
                content: "Coming to university can be overwhelming. Here are 10 practical tips to stay ahead of your studies while maintaining a social life...",
                authorId: admin.id,
                tags: ["Freshers", "Tips", "Success"],
                imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
            },
            {
                title: "Why Modern Web Development is Changing",
                content: "Next.js, Server Components, and the rise of AI tools are reshaping how we build the web. In this post, we explore the latest trends...",
                authorId: mentor1.id,
                tags: ["WebDev", "Tech", "Coding"],
                imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
            },
            {
                title: "The Future of Sustainable Energy",
                content: "Electrical engineering isn't just about circuits anymore. It's about solving the global energy crisis through innovation...",
                authorId: mentor2.id,
                tags: ["EE", "Future", "Sustainability"],
                imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop",
            },
            {
                title: "Mastering Data Structures for Interviews",
                content: "Interviews can be tough. But if you master arrays, linked lists, and trees, you're already 80% there...",
                authorId: mentor1.id,
                tags: ["CS", "Interviews", "DS"],
                imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
            }
        ]
    });

    console.log("Seeding completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
