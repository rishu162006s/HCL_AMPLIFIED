import prisma from "../src/config/prisma";

// ============================================================
// GLOBAL LEARNING DATABASE SEED
// Skills → Topics → Prerequisites → Resources
// ============================================================

async function main() {
  console.log("Starting global learning database seed...");

  // ----------------------------------------------------------
  // SKILLS
  // ----------------------------------------------------------

  const skills = [
    {
  name: "Deep Learning",
  description:
    "Deep learning covering neural networks, optimization, CNNs, RNNs, transformers, representation learning, and practical deep learning workflows.",
},
    {
      name: "SQL",
      description:
        "Structured Query Language for relational databases, data querying, manipulation, and database design.",
    },
    {
      name: "Java",
      description:
        "Java programming language covering programming fundamentals, object-oriented programming, collections, and advanced concepts.",
    },
    {
      name: "Python",
      description:
        "Python programming language covering fundamentals, object-oriented programming, libraries, and practical development.",
    },
    {
      name: "Data Structures",
      description:
        "Core data structures used for efficient storage, organization, and manipulation of data.",
    },
    {
      name: "Algorithms",
      description:
        "Algorithmic problem solving, complexity analysis, searching, sorting, and optimization techniques.",
    },
    {
      name: "Machine Learning",
      description:
        "Machine learning fundamentals including supervised learning, unsupervised learning, model evaluation, and practical ML workflows.",
    },
    {
      name: "Frontend Development",
      description:
        "Web frontend development using HTML, CSS, JavaScript, and modern frontend technologies.",
    },
    {
      name: "Backend Development",
      description:
        "Backend development covering APIs, servers, databases, authentication, and application architecture.",
    },
  ];

  const skillMap: Record<string, string> = {};

  for (const skillData of skills) {
    const skill = await prisma.skill.upsert({
      where: {
        name: skillData.name,
      },
      update: {
        description: skillData.description,
      },
      create: skillData,
    });

    skillMap[skill.name] = skill.id;
  }

  console.log(`Created/updated ${skills.length} global skills.`);

  // ----------------------------------------------------------
  // TOPICS
  // ----------------------------------------------------------

  const topics = [
    // DEEP LEARNING
{
  skill: "Deep Learning",
  name: "Deep Learning Fundamentals",
  description:
    "Introduction to neural networks, tensors, training, inference, parameters, and deep learning workflows.",
},
{
  skill: "Deep Learning",
  name: "Neural Networks",
  description:
    "Understand neurons, layers, weights, biases, activation functions, forward propagation, and neural network architecture.",
},
{
  skill: "Deep Learning",
  name: "Backpropagation",
  description:
    "Understand gradients, computational graphs, chain rule, loss propagation, and gradient-based learning.",
},
{
  skill: "Deep Learning",
  name: "Optimization",
  description:
    "Gradient descent, learning rates, momentum, Adam, learning-rate scheduling, and optimization strategies.",
},
{
  skill: "Deep Learning",
  name: "Regularization",
  description:
    "Prevent overfitting using dropout, weight decay, early stopping, data augmentation, and related techniques.",
},
{
  skill: "Deep Learning",
  name: "Convolutional Neural Networks",
  description:
    "CNN architecture, convolution, filters, pooling, feature maps, image classification, and computer vision applications.",
},
{
  skill: "Deep Learning",
  name: "Recurrent Neural Networks",
  description:
    "Sequence modeling using RNNs, hidden states, sequence prediction, and recurrent architectures.",
},
{
  skill: "Deep Learning",
  name: "LSTM and GRU",
  description:
    "Understand gated recurrent architectures for handling long-term dependencies in sequential data.",
},
{
  skill: "Deep Learning",
  name: "Attention Mechanism",
  description:
    "Understand attention, queries, keys, values, attention weights, and sequence-to-sequence representation.",
},
{
  skill: "Deep Learning",
  name: "Transformers",
  description:
    "Transformer architecture, self-attention, positional encoding, encoder-decoder structures, and modern applications.",
},
{
  skill: "Deep Learning",
  name: "Transfer Learning",
  description:
    "Reuse pretrained neural networks and adapt them to new tasks using fine-tuning and feature extraction.",
},
{
  skill: "Deep Learning",
  name: "Deep Learning with PyTorch",
  description:
    "Build, train, evaluate, and deploy neural networks using PyTorch.",
},
    // SQL
    {
      skill: "SQL",
      name: "SQL Fundamentals",
      description:
        "Introduction to relational databases, SQL syntax, tables, rows, columns, and basic queries.",
    },
    {
      skill: "SQL",
      name: "SELECT Queries",
      description:
        "Retrieve and filter data using SELECT, WHERE, ORDER BY, LIMIT, and related clauses.",
    },
    {
      skill: "SQL",
      name: "Filtering and Sorting",
      description:
        "Filter query results and control result ordering using SQL conditions and sorting operations.",
    },
    {
      skill: "SQL",
      name: "Aggregate Functions",
      description:
        "Use COUNT, SUM, AVG, MIN, and MAX to perform calculations over groups of records.",
    },
    {
      skill: "SQL",
      name: "GROUP BY and HAVING",
      description:
        "Group records and filter aggregated results.",
    },
    {
      skill: "SQL",
      name: "SQL Joins",
      description:
        "Combine data from multiple tables using INNER, LEFT, RIGHT, and FULL joins.",
    },
    {
      skill: "SQL",
      name: "Subqueries",
      description:
        "Use nested queries to solve more complex SQL problems.",
    },
    {
      skill: "SQL",
      name: "Indexes",
      description:
        "Understand database indexes and their impact on query performance.",
    },

    // JAVA
    {
      skill: "Java",
      name: "Java Fundamentals",
      description:
        "Variables, data types, operators, control flow, and basic Java programming.",
    },
    {
      skill: "Java",
      name: "Object-Oriented Programming",
      description:
        "Classes, objects, inheritance, polymorphism, abstraction, and encapsulation.",
    },
    {
      skill: "Java",
      name: "Arrays",
      description:
        "One-dimensional and multidimensional arrays in Java.",
    },
    {
      skill: "Java",
      name: "Strings",
      description:
        "String manipulation, StringBuilder, StringBuffer, and common string operations.",
    },
    {
      skill: "Java",
      name: "Collections Framework",
      description:
        "Lists, sets, maps, queues, and Java collection utilities.",
    },
    {
      skill: "Java",
      name: "Exception Handling",
      description:
        "Handle runtime and checked exceptions using Java exception mechanisms.",
    },
    {
      skill: "Java",
      name: "Generics",
      description:
        "Type-safe reusable Java classes and methods using generics.",
    },

    // PYTHON
    {
      skill: "Python",
      name: "Python Fundamentals",
      description:
        "Python syntax, variables, data types, operators, and control flow.",
    },
    {
      skill: "Python",
      name: "Functions",
      description:
        "Define reusable Python functions, parameters, return values, and scope.",
    },
    {
      skill: "Python",
      name: "Lists and Tuples",
      description:
        "Work with Python sequences including lists, tuples, slicing, and common operations.",
    },
    {
      skill: "Python",
      name: "Dictionaries and Sets",
      description:
        "Use dictionaries and sets for efficient data organization and lookup.",
    },
    {
      skill: "Python",
      name: "Object-Oriented Python",
      description:
        "Classes, objects, inheritance, encapsulation, and polymorphism in Python.",
    },

    // DATA STRUCTURES
    {
      skill: "Data Structures",
      name: "Arrays",
      description:
        "Array-based data representation and common operations.",
    },
    {
      skill: "Data Structures",
      name: "Linked Lists",
      description:
        "Singly linked lists, doubly linked lists, and linked list operations.",
    },
    {
      skill: "Data Structures",
      name: "Stacks",
      description:
        "LIFO data structure and stack-based problem solving.",
    },
    {
      skill: "Data Structures",
      name: "Queues",
      description:
        "FIFO data structure and queue-based problem solving.",
    },
    {
      skill: "Data Structures",
      name: "Hash Tables",
      description:
        "Hashing, collision handling, and constant-time average lookup.",
    },
    {
      skill: "Data Structures",
      name: "Trees",
      description:
        "Tree structures including binary trees and binary search trees.",
    },
    {
      skill: "Data Structures",
      name: "Graphs",
      description:
        "Graph representation, traversal, and fundamental graph concepts.",
    },

    // ALGORITHMS
    {
      skill: "Algorithms",
      name: "Time and Space Complexity",
      description:
        "Analyze algorithm efficiency using Big O notation.",
    },
    {
      skill: "Algorithms",
      name: "Searching",
      description:
        "Linear search, binary search, and search optimization.",
    },
    {
      skill: "Algorithms",
      name: "Sorting",
      description:
        "Comparison-based and non-comparison sorting algorithms.",
    },
    {
      skill: "Algorithms",
      name: "Recursion",
      description:
        "Recursive problem solving and recursive algorithm design.",
    },
    {
      skill: "Algorithms",
      name: "Dynamic Programming",
      description:
        "Solve overlapping-subproblem and optimal-substructure problems.",
    },
    {
      skill: "Algorithms",
      name: "Greedy Algorithms",
      description:
        "Build solutions using locally optimal decisions.",
    },

    // MACHINE LEARNING
    {
      skill: "Machine Learning",
      name: "Machine Learning Fundamentals",
      description:
        "Core concepts, datasets, features, labels, training, validation, and testing.",
    },
    {
      skill: "Machine Learning",
      name: "Linear Regression",
      description:
        "Predict continuous values using linear regression.",
    },
    {
      skill: "Machine Learning",
      name: "Logistic Regression",
      description:
        "Classification using logistic regression.",
    },
    {
      skill: "Machine Learning",
      name: "Decision Trees",
      description:
        "Tree-based supervised learning for classification and regression.",
    },
    {
      skill: "Machine Learning",
      name: "Model Evaluation",
      description:
        "Evaluate machine learning models using appropriate metrics and validation techniques.",
    },

    // FRONTEND
    {
      skill: "Frontend Development",
      name: "HTML Fundamentals",
      description:
        "HTML structure, elements, attributes, forms, and semantic markup.",
    },
    {
      skill: "Frontend Development",
      name: "CSS Fundamentals",
      description:
        "CSS selectors, layout, positioning, responsive design, and styling.",
    },
    {
      skill: "Frontend Development",
      name: "JavaScript Fundamentals",
      description:
        "JavaScript syntax, variables, functions, objects, arrays, and control flow.",
    },
    {
      skill: "Frontend Development",
      name: "DOM Manipulation",
      description:
        "Interact with and modify web pages using the Document Object Model.",
    },

    // BACKEND
    {
      skill: "Backend Development",
      name: "HTTP Fundamentals",
      description:
        "HTTP requests, responses, methods, status codes, headers, and HTTP lifecycle.",
    },
    {
      skill: "Backend Development",
      name: "REST APIs",
      description:
        "Design and consume RESTful APIs using HTTP methods and resource-oriented architecture.",
    },
    {
      skill: "Backend Development",
      name: "Authentication",
      description:
        "User authentication, authorization, sessions, tokens, and JWT.",
    },
    {
      skill: "Backend Development",
      name: "Node.js Fundamentals",
      description:
        "Build backend applications using Node.js and its runtime APIs.",
    },
    {
      skill: "Backend Development",
      name: "Express.js",
      description:
        "Build HTTP APIs and backend services using Express.js.",
    },
    {
  skill: "Machine Learning",
  name: "Data Preprocessing",
  description:
    "Prepare datasets using cleaning, encoding, scaling, transformation, and missing-value handling.",
},
{
  skill: "Machine Learning",
  name: "Feature Engineering",
  description:
    "Create, transform, select, and evaluate features for machine learning models.",
},
{
  skill: "Machine Learning",
  name: "Train Validation Test Split",
  description:
    "Understand proper dataset splitting and how training, validation, and test sets are used.",
},
{
  skill: "Machine Learning",
  name: "K-Nearest Neighbors",
  description:
    "Classification and regression using distance-based nearest-neighbor methods.",
},
{
  skill: "Machine Learning",
  name: "Support Vector Machines",
  description:
    "Classification and regression using maximum-margin methods and kernel functions.",
},
{
  skill: "Machine Learning",
  name: "Random Forests",
  description:
    "Ensemble learning using collections of randomized decision trees.",
},
{
  skill: "Machine Learning",
  name: "Clustering",
  description:
    "Unsupervised learning using clustering techniques such as K-Means.",
},
{
  skill: "Machine Learning",
  name: "Dimensionality Reduction",
  description:
    "Reduce feature dimensions while preserving useful information using techniques such as PCA.",
},
{
  skill: "Machine Learning",
  name: "Cross Validation",
  description:
    "Evaluate model generalization using cross-validation strategies.",
},
{
  skill: "Machine Learning",
  name: "Hyperparameter Tuning",
  description:
    "Improve model performance using systematic hyperparameter search.",
},{
  skill: "Python",
  name: "Control Flow",
  description:
    "Conditional statements, loops, nested control flow, and iteration patterns in Python.",
},
{
  skill: "Python",
  name: "Modules and Packages",
  description:
    "Organize Python applications using modules, packages, imports, and reusable code.",
},
{
  skill: "Python",
  name: "File Handling",
  description:
    "Read, write, append, and process files using Python.",
},
{
  skill: "Python",
  name: "Exception Handling",
  description:
    "Handle errors using try, except, else, finally, and custom exceptions.",
},
{
  skill: "Python",
  name: "List Comprehensions",
  description:
    "Create concise and expressive transformations and filtering operations over Python iterables.",
},
{
  skill: "Python",
  name: "Iterators and Generators",
  description:
    "Understand Python iteration protocols, iterators, generators, and lazy evaluation.",
},
{
  skill: "Python",
  name: "Decorators",
  description:
    "Modify and extend function behavior using Python decorators.",
},
{
  skill: "Python",
  name: "NumPy",
  description:
    "Numerical computing using NumPy arrays, vectorized operations, broadcasting, and linear algebra.",
},
{
  skill: "Python",
  name: "Pandas",
  description:
    "Data manipulation and analysis using Series, DataFrames, indexing, grouping, and transformations.",
},
{
  skill: "Python",
  name: "Matplotlib",
  description:
    "Create data visualizations using Matplotlib.",
},{
  skill: "Java",
  name: "Control Flow",
  description:
    "Conditional statements, loops, switch statements, and control-flow patterns in Java.",
},
{
  skill: "Java",
  name: "Methods",
  description:
    "Define reusable Java methods, parameters, return values, overloading, and method scope.",
},
{
  skill: "Java",
  name: "Interfaces",
  description:
    "Define contracts and achieve abstraction and multiple-type behavior using Java interfaces.",
},
{
  skill: "Java",
  name: "Abstract Classes",
  description:
    "Use abstract classes and methods to design reusable object-oriented abstractions.",
},
{
  skill: "Java",
  name: "Enums",
  description:
    "Represent fixed sets of constants using Java enum types.",
},
{
  skill: "Java",
  name: "Lambda Expressions",
  description:
    "Use Java lambda expressions and functional programming constructs.",
},
{
  skill: "Java",
  name: "Streams",
  description:
    "Process collections declaratively using the Java Stream API.",
},
{
  skill: "Java",
  name: "Multithreading",
  description:
    "Understand threads, concurrency, synchronization, executors, and concurrent programming in Java.",
},
{
  skill: "Java",
  name: "File I/O",
  description:
    "Read, write, and process files using Java I/O APIs.",
},
{
  skill: "Java",
  name: "JDBC",
  description:
    "Connect Java applications to relational databases and execute SQL using JDBC.",
},
  ];

  const topicMap: Record<string, string> = {};

  for (const topicData of topics) {
    const skillId = skillMap[topicData.skill];

    if (!skillId) {
      throw new Error(
        `Skill not found while creating topic: ${topicData.skill}`
      );
    }

    const topic = await prisma.topic.upsert({
      where: {
        skillId_name: {
          skillId,
          name: topicData.name,
        },
      },
      update: {
        description: topicData.description,
      },
      create: {
        name: topicData.name,
        description: topicData.description,
        skillId,
      },
    });

    topicMap[`${topicData.skill}:${topicData.name}`] =
      topic.id;
  }

  console.log(`Created/updated ${topics.length} global topics.`);

  // ----------------------------------------------------------
  // PREREQUISITES
  // ----------------------------------------------------------

  const prerequisites = [
    ["SQL", "SELECT Queries", "SQL Fundamentals"],
    ["SQL", "Filtering and Sorting", "SELECT Queries"],
    ["SQL", "Aggregate Functions", "SELECT Queries"],
    ["SQL", "GROUP BY and HAVING", "Aggregate Functions"],
    ["SQL", "SQL Joins", "SELECT Queries"],
    ["SQL", "Subqueries", "SELECT Queries"],
    ["SQL", "Indexes", "SQL Fundamentals"],

    ["Java", "Object-Oriented Programming", "Java Fundamentals"],
    ["Java", "Arrays", "Java Fundamentals"],
    ["Java", "Strings", "Java Fundamentals"],
    ["Java", "Collections Framework", "Arrays"],
    ["Java", "Exception Handling", "Java Fundamentals"],
    ["Java", "Generics", "Collections Framework"],

    ["Python", "Functions", "Python Fundamentals"],
    ["Python", "Lists and Tuples", "Python Fundamentals"],
    ["Python", "Dictionaries and Sets", "Lists and Tuples"],
    ["Python", "Object-Oriented Python", "Python Fundamentals"],

    ["Data Structures", "Linked Lists", "Arrays"],
    ["Data Structures", "Stacks", "Arrays"],
    ["Data Structures", "Queues", "Arrays"],
    ["Data Structures", "Hash Tables", "Arrays"],
    ["Data Structures", "Trees", "Arrays"],
    ["Data Structures", "Graphs", "Trees"],

    ["Algorithms", "Searching", "Time and Space Complexity"],
    ["Algorithms", "Sorting", "Time and Space Complexity"],
    ["Algorithms", "Recursion", "Time and Space Complexity"],
    ["Algorithms", "Dynamic Programming", "Recursion"],
    ["Algorithms", "Greedy Algorithms", "Time and Space Complexity"],

    ["Machine Learning", "Linear Regression", "Machine Learning Fundamentals"],
    ["Machine Learning", "Logistic Regression", "Machine Learning Fundamentals"],
    ["Machine Learning", "Decision Trees", "Machine Learning Fundamentals"],
    ["Machine Learning", "Model Evaluation", "Machine Learning Fundamentals"],

    ["Frontend Development", "CSS Fundamentals", "HTML Fundamentals"],
    ["Frontend Development", "JavaScript Fundamentals", "HTML Fundamentals"],
    ["Frontend Development", "DOM Manipulation", "JavaScript Fundamentals"],

    ["Backend Development", "REST APIs", "HTTP Fundamentals"],
    ["Backend Development", "Authentication", "HTTP Fundamentals"],
    ["Backend Development", "Node.js Fundamentals", "HTTP Fundamentals"],
    ["Backend Development", "Express.js", "Node.js Fundamentals"],
    // JAVA
["Java", "Control Flow", "Java Fundamentals"],
["Java", "Methods", "Java Fundamentals"],
["Java", "Interfaces", "Object-Oriented Programming"],
["Java", "Abstract Classes", "Object-Oriented Programming"],
["Java", "Enums", "Java Fundamentals"],
["Java", "Lambda Expressions", "Collections Framework"],
["Java", "Streams", "Lambda Expressions"],
["Java", "Multithreading", "Object-Oriented Programming"],
["Java", "File I/O", "Java Fundamentals"],
["Java", "JDBC", "Collections Framework"],

// PYTHON
["Python", "Control Flow", "Python Fundamentals"],
["Python", "Functions", "Control Flow"],
["Python", "Lists and Tuples", "Python Fundamentals"],
["Python", "Dictionaries and Sets", "Lists and Tuples"],
["Python", "Modules and Packages", "Functions"],
["Python", "File Handling", "Functions"],
["Python", "Exception Handling", "Functions"],
["Python", "List Comprehensions", "Lists and Tuples"],
["Python", "Iterators and Generators", "Functions"],
["Python", "Decorators", "Functions"],
["Python", "NumPy", "Lists and Tuples"],
["Python", "Pandas", "Dictionaries and Sets"],
["Python", "Matplotlib", "Pandas"],

// MACHINE LEARNING
["Machine Learning", "Data Preprocessing", "Machine Learning Fundamentals"],
["Machine Learning", "Feature Engineering", "Data Preprocessing"],
["Machine Learning", "Train Validation Test Split", "Data Preprocessing"],
["Machine Learning", "Linear Regression", "Train Validation Test Split"],
["Machine Learning", "Logistic Regression", "Train Validation Test Split"],
["Machine Learning", "K-Nearest Neighbors", "Data Preprocessing"],
["Machine Learning", "Support Vector Machines", "Data Preprocessing"],
["Machine Learning", "Decision Trees", "Data Preprocessing"],
["Machine Learning", "Random Forests", "Decision Trees"],
["Machine Learning", "Clustering", "Machine Learning Fundamentals"],
["Machine Learning", "Dimensionality Reduction", "Data Preprocessing"],
["Machine Learning", "Cross Validation", "Train Validation Test Split"],
["Machine Learning", "Hyperparameter Tuning", "Cross Validation"],
["Machine Learning", "Model Evaluation", "Train Validation Test Split"],

// DEEP LEARNING
["Deep Learning", "Deep Learning Fundamentals", "Machine Learning Fundamentals"],
["Deep Learning", "Deep Learning Fundamentals", "Python:Python Fundamentals"],
["Deep Learning", "Neural Networks", "Deep Learning Fundamentals"],
["Deep Learning", "Backpropagation", "Neural Networks"],
["Deep Learning", "Optimization", "Backpropagation"],
["Deep Learning", "Regularization", "Optimization"],
["Deep Learning", "Convolutional Neural Networks", "Neural Networks"],
["Deep Learning", "Recurrent Neural Networks", "Neural Networks"],
["Deep Learning", "LSTM and GRU", "Recurrent Neural Networks"],
["Deep Learning", "Attention Mechanism", "Recurrent Neural Networks"],
["Deep Learning", "Transformers", "Attention Mechanism"],
["Deep Learning", "Transfer Learning", "Convolutional Neural Networks"],
["Deep Learning", "Deep Learning with PyTorch", "Deep Learning Fundamentals"],
  ] as const;

  for (const [
    topicSkillName,
    topicName,
    prerequisiteReference,
  ] of prerequisites) {
    const topicId =
      topicMap[`${topicSkillName}:${topicName}`];

    const [prerequisiteSkillName, prerequisiteName] =
      prerequisiteReference.includes(":")
        ? prerequisiteReference.split(":")
        : [topicSkillName, prerequisiteReference];

    const prerequisiteId =
      topicMap[
        `${prerequisiteSkillName}:${prerequisiteName}`
      ];

    if (!topicId || !prerequisiteId) {
      throw new Error(
        `Could not resolve prerequisite: ${topicSkillName} → ${topicName} → ${prerequisiteReference}`
      );
    }

    await prisma.topicPrerequisite.upsert({
      where: {
        topicId_prerequisiteId: {
          topicId,
          prerequisiteId,
        },
      },
      update: {},
      create: {
        topicId,
        prerequisiteId,
    },
  });
}
  

  console.log(
    `Created/verified ${prerequisites.length} global prerequisites.`
  );

  // ----------------------------------------------------------
  // GLOBAL RESOURCES
  // ----------------------------------------------------------

 const resources = [

  // ============================================================
  // SQL
  // ============================================================

  {
    title: "SQL Tutorial",
    description: "Complete SQL tutorial covering relational databases and SQL fundamentals.",
    url: "https://www.w3schools.com/sql/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["SQL:SQL Fundamentals"],
  },
  {
    title: "SQL SELECT Statement",
    description: "Learn how to retrieve data using SELECT statements.",
    url: "https://www.w3schools.com/sql/sql_select.asp",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["SQL:SELECT Queries"],
  },
  {
    title: "SQL WHERE Clause",
    description: "Learn how to filter SQL query results.",
    url: "https://www.w3schools.com/sql/sql_where.asp",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["SQL:Filtering and Sorting"],
  },
  {
    title: "SQL GROUP BY",
    description: "Learn grouping and aggregation in SQL.",
    url: "https://www.w3schools.com/sql/sql_groupby.asp",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["SQL:GROUP BY and HAVING"],
  },
  {
    title: "SQL Aggregate Functions",
    description: "COUNT, SUM, AVG, MIN and MAX in SQL.",
    url: "https://www.w3schools.com/sql/sql_count_avg_sum.asp",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["SQL:Aggregate Functions"],
  },
  {
    title: "SQL JOIN Tutorial",
    description: "Learn how to combine rows from multiple tables.",
    url: "https://www.w3schools.com/sql/sql_join.asp",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["SQL:SQL Joins"],
  },
  {
    title: "SQL Subqueries",
    description: "Learn how to use queries inside other queries.",
    url: "https://www.w3schools.com/sql/sql_subqueries.asp",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["SQL:Subqueries"],
  },
  {
    title: "SQL Indexes",
    description: "Understand indexes and database query performance.",
    url: "https://www.w3schools.com/sql/sql_create_index.asp",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["SQL:Indexes"],
  },

  // ============================================================
  // JAVA
  // ============================================================

  {
    title: "Java Tutorials",
    description: "Official Java learning material covering core Java concepts.",
    url: "https://dev.java/learn/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Java:Java Fundamentals"],
  },
  {
    title: "Java Language Documentation",
    description: "Official Java language and API documentation.",
    url: "https://docs.oracle.com/en/java/",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Java Fundamentals"],
  },
  {
    title: "Java OOP Tutorial",
    description: "Learn classes, objects, inheritance, polymorphism and encapsulation.",
    url: "https://www.w3schools.com/java/java_oop.asp",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Object-Oriented Programming"],
  },
  {
    title: "Java Arrays",
    description: "Learn one-dimensional and multidimensional arrays.",
    url: "https://www.w3schools.com/java/java_arrays.asp",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Java:Arrays"],
  },
  {
    title: "Java Strings",
    description: "Learn String operations and manipulation in Java.",
    url: "https://www.w3schools.com/java/java_strings.asp",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Java:Strings"],
  },
  {
    title: "Java Collections Framework",
    description: "Learn Lists, Sets, Maps and other Java collections.",
    url: "https://docs.oracle.com/javase/tutorial/collections/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Collections Framework"],
  },
  {
    title: "Java Exception Handling",
    description: "Learn checked exceptions, unchecked exceptions and exception handling.",
    url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Exception Handling"],
  },
  {
    title: "Java Generics",
    description: "Learn generic classes, methods and type-safe collections.",
    url: "https://docs.oracle.com/javase/tutorial/java/generics/",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Generics"],
  },
  {
    title: "Java Control Flow",
    description: "Learn if, else, switch and loops in Java.",
    url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Java:Control Flow"],
  },
  {
    title: "Java Methods",
    description: "Learn method declaration, parameters, return values and overloading.",
    url: "https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Java:Methods"],
  },
  {
    title: "Java Interfaces",
    description: "Learn interfaces and abstraction in Java.",
    url: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Interfaces"],
  },
  {
    title: "Java Abstract Classes",
    description: "Learn abstract classes and abstract methods.",
    url: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Abstract Classes"],
  },
  {
    title: "Java Enums",
    description: "Learn enumeration types in Java.",
    url: "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Enums"],
  },
  {
    title: "Java Lambda Expressions",
    description: "Learn lambda expressions and functional programming concepts.",
    url: "https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:Lambda Expressions"],
  },
  {
    title: "Java Stream API",
    description: "Learn functional-style processing of collections using streams.",
    url: "https://docs.oracle.com/javase/tutorial/collections/streams/",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Java:Streams"],
  },
  {
    title: "Java Concurrency",
    description: "Learn threads, synchronization and concurrent programming.",
    url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Java:Multithreading"],
  },
  {
    title: "Java File I/O",
    description: "Learn reading and writing files using Java I/O APIs.",
    url: "https://docs.oracle.com/javase/tutorial/essential/io/",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Java:File I/O"],
  },
  {
    title: "JDBC Basics",
    description: "Learn how Java applications connect to relational databases.",
    url: "https://docs.oracle.com/javase/tutorial/jdbc/basics/",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Java:JDBC"],
  },

  // ============================================================
  // PYTHON
  // ============================================================

  {
    title: "Python Official Tutorial",
    description: "Official Python tutorial covering the language fundamentals.",
    url: "https://docs.python.org/3/tutorial/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:Python Fundamentals"],
  },
  {
    title: "Python Control Flow",
    description: "Learn conditions, loops and control flow.",
    url: "https://docs.python.org/3/tutorial/controlflow.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:Control Flow"],
  },
  {
    title: "Python Functions",
    description: "Learn function definitions, parameters, arguments and return values.",
    url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:Functions"],
  },
  {
    title: "Python Lists and Tuples",
    description: "Learn Python sequence types and sequence operations.",
    url: "https://docs.python.org/3/tutorial/datastructures.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:Lists and Tuples"],
  },
  {
    title: "Python Dictionaries and Sets",
    description: "Learn dictionaries, sets and efficient lookup structures.",
    url: "https://docs.python.org/3/tutorial/datastructures.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:Dictionaries and Sets"],
  },
  {
    title: "Python Modules",
    description: "Learn modules, imports and package organization.",
    url: "https://docs.python.org/3/tutorial/modules.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:Modules and Packages"],
  },
  {
    title: "Python File Handling",
    description: "Learn reading, writing and processing files.",
    url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Python:File Handling"],
  },
  {
    title: "Python Exceptions",
    description: "Learn exception handling with try, except, else and finally.",
    url: "https://docs.python.org/3/tutorial/errors.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:Exception Handling"],
  },
  {
    title: "Python List Comprehensions",
    description: "Learn concise list creation and transformation.",
    url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:List Comprehensions"],
  },
  {
    title: "Python Iterators and Generators",
    description: "Learn iterators, generators and lazy evaluation.",
    url: "https://docs.python.org/3/howto/functional.html",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Python:Iterators and Generators"],
  },
  {
    title: "Python Decorators",
    description: "Learn function decorators and higher-order programming.",
    url: "https://peps.python.org/pep-0318/",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Python:Decorators"],
  },
  {
    title: "NumPy Documentation",
    description: "Official NumPy documentation for numerical computing.",
    url: "https://numpy.org/doc/stable/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:NumPy"],
  },
  {
    title: "Pandas Documentation",
    description: "Official pandas documentation for data analysis.",
    url: "https://pandas.pydata.org/docs/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:Pandas"],
  },
  {
    title: "Matplotlib Documentation",
    description: "Official Matplotlib plotting and visualization documentation.",
    url: "https://matplotlib.org/stable/users/index.html",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Python:Matplotlib"],
  },

  // ============================================================
  // DATA STRUCTURES
  // ============================================================

  {
    title: "Arrays Data Structure",
    description: "Learn arrays and their fundamental operations.",
    url: "https://www.geeksforgeeks.org/array-data-structure/",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Data Structures:Arrays"],
  },
  {
    title: "Linked List",
    description: "Learn singly and doubly linked lists.",
    url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Data Structures:Linked Lists"],
  },
  {
    title: "Stack Data Structure",
    description: "Learn the LIFO stack data structure.",
    url: "https://www.geeksforgeeks.org/stack-data-structure/",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Data Structures:Stacks"],
  },
  {
    title: "Queue Data Structure",
    description: "Learn FIFO queues and queue operations.",
    url: "https://www.geeksforgeeks.org/queue-data-structure/",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Data Structures:Queues"],
  },
  {
    title: "Hashing",
    description: "Learn hash tables, hashing and collision handling.",
    url: "https://www.geeksforgeeks.org/hashing-data-structure/",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Data Structures:Hash Tables"],
  },
  {
    title: "Tree Data Structure",
    description: "Learn trees, binary trees and binary search trees.",
    url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Data Structures:Trees"],
  },
  {
    title: "Graph Data Structure",
    description: "Learn graph representation and traversal.",
    url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Data Structures:Graphs"],
  },

  // ============================================================
  // ALGORITHMS
  // ============================================================

  {
    title: "Big O Complexity",
    description: "Learn time and space complexity analysis.",
    url: "https://www.geeksforgeeks.org/analysis-algorithms-big-o-analysis/",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Algorithms:Time and Space Complexity"],
  },
  {
    title: "Searching Algorithms",
    description: "Learn linear search, binary search and related techniques.",
    url: "https://www.geeksforgeeks.org/searching-algorithms/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Algorithms:Searching"],
  },
  {
    title: "Sorting Algorithms",
    description: "Learn comparison and non-comparison sorting algorithms.",
    url: "https://www.geeksforgeeks.org/sorting-algorithms/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Algorithms:Sorting"],
  },
  {
    title: "Recursion",
    description: "Learn recursive problem solving and recursive algorithms.",
    url: "https://www.geeksforgeeks.org/recursion/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Algorithms:Recursion"],
  },
  {
    title: "Dynamic Programming",
    description: "Learn overlapping subproblems and optimal substructure.",
    url: "https://www.geeksforgeeks.org/dynamic-programming/",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Algorithms:Dynamic Programming"],
  },
  {
    title: "Greedy Algorithms",
    description: "Learn algorithms based on locally optimal decisions.",
    url: "https://www.geeksforgeeks.org/greedy-algorithms/",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Algorithms:Greedy Algorithms"],
  },

  // ============================================================
  // MACHINE LEARNING
  // ============================================================

  {
    title: "Scikit-learn User Guide",
    description: "Comprehensive machine learning guide using scikit-learn.",
    url: "https://scikit-learn.org/stable/user_guide.html",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Machine Learning Fundamentals"],
  },
  {
    title: "Machine Learning Crash Course",
    description: "Practical introduction to machine learning concepts.",
    url: "https://developers.google.com/machine-learning/crash-course",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Machine Learning:Machine Learning Fundamentals"],
  },
  {
    title: "Data Preprocessing",
    description: "Learn cleaning, encoding, scaling and transformation of datasets.",
    url: "https://scikit-learn.org/stable/modules/preprocessing.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Data Preprocessing"],
  },
  {
    title: "Feature Engineering",
    description: "Learn how to create and transform useful machine learning features.",
    url: "https://scikit-learn.org/stable/modules/feature_selection.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Feature Engineering"],
  },
  {
    title: "Train Test Split",
    description: "Learn proper training and testing dataset separation.",
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html",
    type: "ARTICLE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Machine Learning:Train Validation Test Split"],
  },
  {
    title: "Linear Regression",
    description: "Learn regression for continuous-value prediction.",
    url: "https://scikit-learn.org/stable/modules/linear_model.html",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Machine Learning:Linear Regression"],
  },
  {
    title: "Logistic Regression",
    description: "Learn logistic regression for classification.",
    url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Logistic Regression"],
  },
  {
    title: "K Nearest Neighbors",
    description: "Learn distance-based classification and regression.",
    url: "https://scikit-learn.org/stable/modules/neighbors.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:K-Nearest Neighbors"],
  },
  {
    title: "Support Vector Machines",
    description: "Learn maximum-margin classification and kernel methods.",
    url: "https://scikit-learn.org/stable/modules/svm.html",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Machine Learning:Support Vector Machines"],
  },
  {
    title: "Decision Trees",
    description: "Learn decision tree classification and regression.",
    url: "https://scikit-learn.org/stable/modules/tree.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Decision Trees"],
  },
  {
    title: "Random Forests",
    description: "Learn ensemble learning using randomized decision trees.",
    url: "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Random Forests"],
  },
  {
    title: "Clustering",
    description: "Learn unsupervised clustering including K-Means.",
    url: "https://scikit-learn.org/stable/modules/clustering.html",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Clustering"],
  },
  {
    title: "Dimensionality Reduction",
    description: "Learn PCA and dimensionality reduction techniques.",
    url: "https://scikit-learn.org/stable/modules/decomposition.html",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Machine Learning:Dimensionality Reduction"],
  },
  {
    title: "Cross Validation",
    description: "Learn cross-validation strategies for model evaluation.",
    url: "https://scikit-learn.org/stable/modules/cross_validation.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Cross Validation"],
  },
  {
    title: "Hyperparameter Tuning",
    description: "Learn systematic hyperparameter search and optimization.",
    url: "https://scikit-learn.org/stable/modules/grid_search.html",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Machine Learning:Hyperparameter Tuning"],
  },
  {
    title: "Model Evaluation",
    description: "Learn classification, regression and model evaluation metrics.",
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Machine Learning:Model Evaluation"],
  },

  // ============================================================
  // DEEP LEARNING
  // ============================================================

  {
    title: "Deep Learning Specialization",
    description: "Structured deep learning course covering neural networks and modern architectures.",
    url: "https://www.deeplearning.ai/courses/deep-learning-specialization/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Deep Learning Fundamentals"],
  },
  {
    title: "Neural Networks and Deep Learning",
    description: "Introduction to neural networks and deep learning.",
    url: "https://www.deeplearning.ai/courses/neural-networks-deep-learning/",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Deep Learning:Neural Networks"],
  },
  {
    title: "PyTorch Autograd",
    description: "Learn automatic differentiation and gradient computation.",
    url: "https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Backpropagation"],
  },
  {
    title: "PyTorch Optimization",
    description: "Learn optimization and training neural networks with PyTorch.",
    url: "https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Optimization"],
  },
  {
    title: "Regularization",
    description: "Learn techniques for reducing overfitting in neural networks.",
    url: "https://www.deeplearning.ai/courses/deep-learning-specialization/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Regularization"],
  },
  {
    title: "Convolutional Neural Networks",
    description: "Learn convolution, filters, pooling and image recognition.",
    url: "https://cs231n.github.io/convolutional-networks/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Convolutional Neural Networks"],
  },
  {
    title: "Recurrent Neural Networks",
    description: "Learn recurrent architectures for sequential data.",
    url: "https://www.deeplearning.ai/courses/deep-learning-specialization/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Recurrent Neural Networks"],
  },
  {
    title: "LSTM Networks",
    description: "Learn gated recurrent neural networks and long-term dependencies.",
    url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Deep Learning:LSTM and GRU"],
  },
  {
    title: "Attention Is All You Need",
    description: "Foundational paper introducing the Transformer architecture.",
    url: "https://arxiv.org/abs/1706.03762",
    type: "BOOK" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Deep Learning:Attention Mechanism"],
  },
  {
    title: "The Illustrated Transformer",
    description: "Visual explanation of attention and Transformer architecture.",
    url: "https://jalammar.github.io/illustrated-transformer/",
    type: "ARTICLE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Deep Learning:Transformers"],
  },
  {
    title: "Transfer Learning Tutorial",
    description: "Learn feature extraction and fine-tuning using pretrained models.",
    url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
    type: "COURSE" as const,
    difficulty: "ADVANCED" as const,
    topics: ["Deep Learning:Transfer Learning"],
  },
  {
    title: "PyTorch Tutorials",
    description: "Official PyTorch tutorials for building and training neural networks.",
    url: "https://docs.pytorch.org/tutorials/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Deep Learning:Deep Learning with PyTorch"],
  },

  // ============================================================
  // FRONTEND
  // ============================================================

  {
    title: "MDN HTML",
    description: "Complete HTML reference and learning material.",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Frontend Development:HTML Fundamentals"],
  },
  {
    title: "MDN CSS",
    description: "Complete CSS reference and learning material.",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Frontend Development:CSS Fundamentals"],
  },
  {
    title: "MDN JavaScript",
    description: "JavaScript language guide and reference.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Frontend Development:JavaScript Fundamentals"],
  },
  {
    title: "MDN DOM",
    description: "Learn DOM APIs and browser document manipulation.",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Frontend Development:DOM Manipulation"],
  },

  // ============================================================
  // BACKEND
  // ============================================================

  {
    title: "MDN HTTP Overview",
    description: "Learn HTTP requests, responses, methods and status codes.",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Backend Development:HTTP Fundamentals"],
  },
  {
    title: "REST API Concepts",
    description: "Learn REST architecture and resource-oriented API design.",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Backend Development:REST APIs"],
  },
  {
    title: "JWT Introduction",
    description: "Learn JSON Web Tokens and token-based authentication.",
    url: "https://jwt.io/introduction",
    type: "ARTICLE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Backend Development:Authentication"],
  },
  {
    title: "Node.js Learn",
    description: "Official Node.js learning resources.",
    url: "https://nodejs.org/en/learn",
    type: "COURSE" as const,
    difficulty: "BEGINNER" as const,
    topics: ["Backend Development:Node.js Fundamentals"],
  },
  {
    title: "Express.js Guide",
    description: "Official Express.js documentation and API development guide.",
    url: "https://expressjs.com/",
    type: "COURSE" as const,
    difficulty: "INTERMEDIATE" as const,
    topics: ["Backend Development:Express.js"],
  },
];
  for (const resourceData of resources) {
    const resource = await prisma.resource.upsert({
      where: {
        id: (
          await prisma.resource.findFirst({
            where: {
              url: resourceData.url,
            },
            select: {
              id: true,
            },
          })
        )?.id ?? "00000000-0000-0000-0000-000000000000",
      },
      update: {
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        difficulty: resourceData.difficulty,
      },
      create: {
        title: resourceData.title,
        description: resourceData.description,
        url: resourceData.url,
        type: resourceData.type,
        difficulty: resourceData.difficulty,
      },
    });

    for (const topicKey of resourceData.topics) {
      const topicId = topicMap[topicKey];

      if (!topicId) {
        throw new Error(
          `Topic not found for resource: ${topicKey}`
        );
      }

      await prisma.topicResource.upsert({
        where: {
          topicId_resourceId: {
            topicId,
            resourceId: resource.id,
          },
        },
        update: {},
        create: {
          topicId,
          resourceId: resource.id,
        },
      });
    }
  }

  console.log(
    `Created/updated ${resources.length} global resources.`
  );

  console.log(
    "Global learning database seeded successfully."
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });