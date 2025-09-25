import type { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  personalInfo: {
    name: 'Manas Naidu',
    title: 'Java Full Stack Developer',
    email: 'manasnaidu.jsd@gmail.com',
    phone: '+1 (385) 325-6253',
    location: 'San Francisco, California',
    summary: 'Java Full Stack Developer with 5+ years of experience designing and optimizing scalable microservices and web applications across finance, healthcare, and e-commerce. Skilled in Java (8,11,17), Spring Boot, REST APIs, and cloud platforms (AWS, Azure), with strong expertise in CI/CD automation, security, and testing. Proven record of improving system performance, reducing onboarding errors, and delivering resilient event-driven architectures with Kafka and RabbitMQ.',
    profileImage: '/images/projects/Profile_pic.JPG'
  },
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/Manasbandaru',
      icon: 'github'
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/manasnaidujsd/',
      icon: 'linkedin'
    }
  ],
  skills: [
    // Backend Development
    { name: 'Java (8, 11, 17)', category: 'backend', proficiency: 5, yearsOfExperience: 5 },
    { name: 'Spring Boot', category: 'backend', proficiency: 5, yearsOfExperience: 5 },
    { name: 'Spring Security', category: 'backend', proficiency: 5, yearsOfExperience: 4 },
    { name: 'Hibernate/JPA', category: 'backend', proficiency: 5, yearsOfExperience: 4 },
    { name: 'REST APIs', category: 'backend', proficiency: 5, yearsOfExperience: 5 },
    { name: 'Microservices', category: 'backend', proficiency: 5, yearsOfExperience: 4 },
    { name: 'Node.js', category: 'backend', proficiency: 3, yearsOfExperience: 2 },
    { name: 'Express.js', category: 'backend', proficiency: 3, yearsOfExperience: 2 },

    // Frontend Development
    { name: 'React', category: 'frontend', proficiency: 4, yearsOfExperience: 3 },
    { name: 'Angular', category: 'frontend', proficiency: 4, yearsOfExperience: 2 },
    { name: 'TypeScript', category: 'frontend', proficiency: 4, yearsOfExperience: 3 },
    { name: 'JavaScript', category: 'frontend', proficiency: 4, yearsOfExperience: 4 },
    { name: 'JSP', category: 'frontend', proficiency: 4, yearsOfExperience: 3 },
    { name: 'HTML5', category: 'frontend', proficiency: 5, yearsOfExperience: 5 },
    { name: 'CSS3', category: 'frontend', proficiency: 4, yearsOfExperience: 5 },

    // Cloud & DevOps
    { name: 'AWS', category: 'tools', proficiency: 4, yearsOfExperience: 3 },
    { name: 'Azure', category: 'tools', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Docker', category: 'tools', proficiency: 4, yearsOfExperience: 3 },
    { name: 'Kubernetes', category: 'tools', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Terraform', category: 'tools', proficiency: 3, yearsOfExperience: 1 },
    { name: 'Jenkins', category: 'tools', proficiency: 4, yearsOfExperience: 3 },
    { name: 'GitHub Actions', category: 'tools', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Git', category: 'tools', proficiency: 5, yearsOfExperience: 5 },

    // Databases & Messaging
    { name: 'PostgreSQL', category: 'database', proficiency: 5, yearsOfExperience: 4 },
    { name: 'MongoDB', category: 'database', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Redshift', category: 'database', proficiency: 3, yearsOfExperience: 1 },
    { name: 'Apache Kafka', category: 'database', proficiency: 4, yearsOfExperience: 3 },
    { name: 'RabbitMQ', category: 'database', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Amazon SQS', category: 'database', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Hazelcast', category: 'database', proficiency: 3, yearsOfExperience: 1 },

    // Testing & Monitoring
    { name: 'JUnit', category: 'testing', proficiency: 5, yearsOfExperience: 5 },
    { name: 'Mockito', category: 'testing', proficiency: 5, yearsOfExperience: 4 },
    { name: 'Postman', category: 'testing', proficiency: 5, yearsOfExperience: 4 },
    { name: 'Selenium', category: 'testing', proficiency: 4, yearsOfExperience: 3 },
    { name: 'JMeter', category: 'testing', proficiency: 4, yearsOfExperience: 2 },
    { name: 'Azure Monitor', category: 'monitoring', proficiency: 3, yearsOfExperience: 1 },
    { name: 'New Relic', category: 'monitoring', proficiency: 3, yearsOfExperience: 1 },
    { name: 'Splunk', category: 'monitoring', proficiency: 3, yearsOfExperience: 1 },

    // ML/AI Integration
    { name: 'AWS SageMaker', category: 'ai', proficiency: 3, yearsOfExperience: 2 },
    { name: 'Python', category: 'ai', proficiency: 3, yearsOfExperience: 2 },
    { name: 'Pandas', category: 'ai', proficiency: 3, yearsOfExperience: 1 },
    { name: 'NumPy', category: 'ai', proficiency: 3, yearsOfExperience: 1 },
    { name: 'Scikit-learn', category: 'ai', proficiency: 3, yearsOfExperience: 1 }
  ],
  projects: [
    {
      id: '1',
      title: 'E-Commerce Microservices Platform',
      description: 'A scalable e-commerce platform built with Spring Boot microservices, featuring user management, product catalog, order processing, and payment integration.',
      longDescription: 'This comprehensive e-commerce platform demonstrates modern microservices architecture using Spring Boot, Spring Cloud, and Docker. The system includes separate services for user authentication, product management, inventory tracking, order processing, and payment handling. Each service is independently deployable and communicates through REST APIs and message queues.',
      technologies: ['Java', 'Spring Boot', 'Spring Cloud', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Apache Kafka', 'JWT'],
      githubUrl: 'https://github.com/Manasbandaru/ecommerce-microservices',
      imageUrl: '/images/projects/E_Commeerce_microservice.png',
      featured: true,
      startDate: '2023-06',
      endDate: '2023-12',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Task Management REST API',
      description: 'A robust task management system with RESTful APIs, JWT authentication, role-based access control, and real-time notifications.',
      longDescription: 'A full-featured task management application built with Spring Boot and Spring Security. Features include user authentication with JWT tokens, role-based permissions, task assignment and tracking, file attachments, email notifications, and comprehensive audit logging. The API follows REST best practices and includes comprehensive documentation with Swagger.',
      technologies: ['Java', 'Spring Boot', 'Spring Security', 'JPA/Hibernate', 'MySQL', 'JWT', 'Swagger', 'Maven'],
      githubUrl: 'https://github.com/Manasbandaru/task-management-api',
      imageUrl: '/images/projects/Task_management_rest_API.png',
      featured: true,
      startDate: '2023-03',
      endDate: '2023-05',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Real-time Chat Application',
      description: 'A real-time messaging application using WebSocket connections, with features like group chats, file sharing, and message history.',
      longDescription: 'A modern chat application built with Spring Boot and WebSocket technology. Features include real-time messaging, group chat rooms, private messaging, file sharing capabilities, message history with pagination, user presence indicators, and emoji support. The frontend is built with React and connects seamlessly to the Spring Boot backend.',
      technologies: ['Java', 'Spring Boot', 'WebSocket', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      githubUrl: 'https://github.com/Manasbandaru/realtime-chat',
      imageUrl: '/images/projects/Real_time_chat_application.png',
      featured: true,
      startDate: '2023-01',
      endDate: '2023-02',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Inventory Management System',
      description: 'An enterprise inventory management system with barcode scanning, automated reordering, and comprehensive reporting features.',
      longDescription: 'A comprehensive inventory management solution designed for small to medium businesses. Built with Spring Boot and featuring a clean web interface, the system handles product tracking, stock levels, supplier management, automated reordering based on minimum stock levels, barcode generation and scanning, and detailed reporting with charts and analytics.',
      technologies: ['Java', 'Spring Boot', 'Thymeleaf', 'JPA/Hibernate', 'H2 Database', 'Chart.js', 'Bootstrap'],
      githubUrl: 'https://github.com/Manasbandaru/inventory-management',
      imageUrl: '/images/projects/Inventory_Management_System.png',
      featured: false,
      startDate: '2022-09',
      endDate: '2022-12',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Banking System API',
      description: 'A secure banking system with account management, transaction processing, and fraud detection capabilities.',
      longDescription: 'A secure banking application demonstrating financial software development best practices. Features include account creation and management, secure transaction processing, balance inquiries, transaction history, basic fraud detection algorithms, and comprehensive audit trails. Built with emphasis on security, data integrity, and regulatory compliance.',
      technologies: ['Java', 'Spring Boot', 'Spring Security', 'PostgreSQL', 'JUnit', 'Mockito', 'Maven'],
      githubUrl: 'https://github.com/Manasbandaru/banking-system',
      imageUrl: '/images/projects/Banking_system_API.png',
      featured: false,
      startDate: '2022-06',
      endDate: '2022-08',
      status: 'completed'
    }
  ],
  experience: [
    {
      id: '1',
      company: 'JPMorgan Chase & Co.',
      position: 'Java Full Stack Developer',
      location: 'New York, US',
      startDate: '2024-05',
      current: true,
      description: 'Financial Transactions & Risk Intelligence Platform – Engineered scalable microservices and dashboards to power digital onboarding, transaction tracking, and fraud detection for enterprise banking operations.',
      achievements: [
        'Developed Java 17/Spring Boot REST APIs for payment reconciliations and digital onboarding, improving system reliability and reducing onboarding errors by 20%',
        'Built React dashboards to visualize real-time fraud alerts, financial events, and portfolio performance, enabling faster incident response by compliance teams',
        'Owned the CI/CD pipeline automation initiative, collaborating with DevOps and security teams to standardize deployments across multiple applications',
        'Integrated AWS services (Lambda, S3, DynamoDB) for serverless processing and event-driven workflows, reducing infrastructure costs and improving scalability',
        'Optimized React dashboard performance and reduced page load times by 20%, improving usability and adoption among compliance and risk management teams',
        'Collaborated with ML engineers to deploy AWS SageMaker-based credit risk scoring models, enhancing loan decision workflows and lowering false-positive rates in fraud detection',
        'Designed Kafka and Amazon SQS messaging pipelines to ensure resilient processing of high-volume payment events and audit logs',
        'Optimized PostgreSQL schemas and queries, cutting report generation time by 40% for internal financial reporting tools',
        'Automated CI/CD pipelines with Jenkins, GitHub Actions, and AWS CodePipeline, reducing release cycle time by 35%',
        'Maintained compliance and stability of banking APIs through comprehensive testing (JUnit, Selenium, Postman) and close alignment with regulatory standards'
      ],
      technologies: ['Java 17', 'Spring Boot', 'React', 'AWS', 'Kafka', 'PostgreSQL', 'Jenkins', 'GitHub Actions']
    },
    {
      id: '2',
      company: 'Atrium Health',
      position: 'Software Engineer - Java',
      location: 'Charlotte, NC',
      startDate: '2023-04',
      endDate: '2024-04',
      current: false,
      description: 'Real-Time Patient Monitoring & EHR Integration Platform – Designed and implemented secure, event-driven microservices to enable patient scheduling, medication order workflows, and seamless EHR interoperability across clinical systems.',
      achievements: [
        'Developed HL7/FHIR-compliant REST APIs that connected EMR systems with patient-facing mobile apps, enabling faster and more accurate data sharing across providers and improving patient engagement',
        'Built Kafka-based streaming pipelines to deliver real-time alerts (lab results, vitals, medication errors) to provider dashboards, reducing average response time to critical events by 25%',
        'Integrated AWS SageMaker predictive models for disease risk scoring (e.g., heart failure, diabetes), improving clinical decision support and helping physicians provide proactive care',
        'Implemented Spring Security with OAuth2/JWT for HIPAA-compliant access control, ensuring the secure handling of sensitive patient data across all services',
        'Acted as a key point of contact between clinicians and engineering teams, translating healthcare requirements into secure technical solutions',
        'Automated ETL pipelines in Python to transform unstructured clinical notes for NLP models, increasing predictive analytics accuracy by 15%',
        'Maintained high code quality with 90%+ test coverage (JUnit 5, Mockito, Postman), strengthening reliability of patient-critical applications',
        'Led CI/CD automation with Azure DevOps, reducing deployment cycles from days to hours and improving release frequency by 40%'
      ],
      technologies: ['Java', 'Spring Boot', 'Spring Security', 'Kafka', 'AWS SageMaker', 'Azure DevOps', 'HL7/FHIR', 'Python']
    },
    {
      id: '3',
      company: 'Flipkart',
      position: 'Associate Java Developer',
      location: 'Hyderabad, Telangana',
      startDate: '2020-03',
      endDate: '2022-07',
      current: false,
      description: 'E-Commerce Order & Personalization Platform – Contributed to the design and scaling of core cart, order processing, and returns systems powering millions of daily transactions across Flipkart\'s marketplace.',
      achievements: [
        'Developed and optimized Java 11/Spring Boot microservices for cart and checkout workflows, improving system throughput and reducing cart latency by 30% during seasonal sales',
        'Integrated ML-driven recommendation engine APIs to personalize product suggestions, increasing conversion rates across multiple user segments by 12%',
        'Built responsive JSP/HTML5/JavaScript components for cart and checkout flows, improving page responsiveness and enhancing customer experience, which contributed to a 15% increase in successful checkouts during peak traffic',
        'Collaborated with Data Science teams to consume Kubernetes-hosted ML outputs for dynamic pricing and inventory reordering, reducing stockouts and overstock incidents',
        'Built real-time messaging and synchronization between distributed services using Kafka and RabbitMQ, ensuring reliable order and inventory updates under peak traffic',
        'Enhanced PostgreSQL query performance for large datasets, improving average query response times by 25%',
        'Mentored 2 junior developers on Java and Spring Boot best practices, conducting code reviews that improved overall code quality and reduced bugs in production',
        'Implemented regression and load testing (JUnit, Selenium, JMeter) to validate scalability of high-traffic e-commerce systems, supporting events like Big Billion Days',
        'Actively participated in Agile ceremonies and code reviews, contributing to iterative feature delivery and alignment with product and AI experimentation cycles'
      ],
      technologies: ['Java 11', 'Spring Boot', 'JSP', 'JavaScript', 'Kafka', 'RabbitMQ', 'PostgreSQL', 'Kubernetes', 'JMeter']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Cincinnati',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2022-08',
      endDate: '2024-04',
      location: 'OH, USA',
      achievements: [
        'Advanced Algorithms and Data Structures',
        'Distributed Systems and Microservices',
        'Machine Learning and AI',
        'Software Architecture and Design Patterns',
        'Database Systems and Big Data',
        'Cloud Computing and DevOps',
        'Software Engineering Methodologies',
        'Computer Networks and Security',
        'Graduate Research in AI/ML Applications',
        'Teaching Assistant for Java Programming'
      ]
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'Oracle Certified Professional: Java SE 11 Developer',
      issuer: 'Oracle',
      issueDate: '2021-03',
      credentialId: 'OCP-JSE11-2021-MN789',
      credentialUrl: 'https://www.credly.com/badges/oracle-java-se-11-developer'
    }
  ]
};

export const heroContent = {
  name: 'Manas Naidu',
  titles: [
    'Java Full Stack Developer',
    'Spring Boot Expert',
    'Microservices Architect',
    'Cloud Solutions Engineer'
  ],
  yearsExperience: 5,
  tagline: 'Building robust, scalable applications across finance, healthcare, and e-commerce',
  description: 'Versatile engineer with expertise in Java (8,11,17), Spring Boot, REST APIs, and cloud platforms (AWS, Azure). Proven record of improving system performance, reducing errors, and delivering resilient event-driven architectures.',
  ctaButtons: [
    {
      text: 'View My Work',
      href: '#experience',
      primary: true
    },
    {
      text: 'Download Resume',
      href: '/resume/Manas_Resume_Java.pdf',
      primary: false
    }
  ]
};