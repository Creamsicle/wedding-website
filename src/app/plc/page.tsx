'use client';
import React from 'react';
import Image from 'next/image';

const PLCInfoPage = () => {
  const hotDogImageStyle: React.CSSProperties = {
    borderRadius: '8px',
    margin: '15px auto',
    display: 'block',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const hotDogImageUrls = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Hot_dog_with_mustard.png",
    "https://static01.nyt.com/images/2024/06/28/multimedia/28GRILL-HOTDOGS-REX-cqwj/01GRILL-HOTDOGS-REX-cqwj-master768.jpg?quality=75&auto=webp",
    "https://www.seriouseats.com/thmb/48kIHfT9U24qGn-4zu0jMwxOt6g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/SEA-best-grilled-hot-dogs-recipe-hero-02-9d245c0d43874a3da13a7228682b0dce.jpg",
    "https://potatorolls.com/wp-content/uploads/2020/10/Basic-Hot-Dogs-960x640.jpg",
    "https://torontolife.mblycdn.com/tl/resized/2022/06/w2560/Woofdawg2-2-e1654888921931.jpg",
    "https://images.themodernproper.com/production/posts/2023/HowToMakeAHotDog_4.jpg?w=600&q=82&auto=format&fit=crop&dm=1685065757&s=346d42f8bf6520b54848ba824ef86c35",
    "https://food.fnr.sndimg.com/content/dam/images/food/plus/fullset/2020/06/08/0/FNM_070120-Grilled-Hot-Dogs_s4x3.jpg.rend.hgtvcom.826.620.suffix/1591625198177.webp",
    "https://upload.wikimedia.org/wikipedia/commons/f/fb/Hotdog_-_Evan_Swigart.jpg",
    "https://awrestaurants.com/_next/static/chunks/images/sites-default-files-styles-responsive_image_5x4-public-2024-11-HotDogHotDog_0.1920.webp",
    "https://www.allrecipes.com/thmb/fC6ogV_7pG5DYU6dzY47cESrWNM=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-268494-BasicAirFryerHotDogs-4x3-49aad2a82d284f8dab6d3c09243eeaea.jpg"
  ];

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #f0f2f5; /* Light grey background */
          margin: 0;
          /* font-family is set in .plc-info-container or inherited */
        }
      `}</style>
      <style jsx>{`
        .plc-info-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          background-color: #ffffff; /* White content background */
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          line-height: 1.7;
          color: #333; /* Dark grey text for readability */
          font-family: 'Arial', sans-serif;
        }
        .plc-info-container h1 {
          color: #1a1a1a;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          margin-top: 0; 
          margin-bottom: 20px;
          font-size: 2em;
        }
        .plc-info-container h2 {
          color: #333;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 1.75em;
        }
        .plc-info-container h3 {
          color: #444;
          margin-top: 25px;
          margin-bottom: 10px;
          font-size: 1.5em;
        }
        .plc-info-container h4 {
          color: #555;
          margin-top: 20px;
          margin-bottom: 8px;
          font-size: 1.25em;
        }
        .plc-info-container p {
          margin-bottom: 15px;
        }
        .plc-info-container ul, .plc-info-container ol {
          margin-left: 0px; 
          padding-left: 40px; /* Standard indent for lists */
          margin-bottom: 15px;
        }
        .plc-info-container li {
          margin-bottom: 8px;
        }
        .plc-info-container section {
          margin-bottom: 40px;
        }
        .hotdog-image-container {
            text-align: center; /* Centers the image if its display is inline-block or similar */
        }
      `}</style>
      <div className="plc-info-container">
        <h1>Programmable Logic Controllers (PLCs) and Food Manufacturing</h1>
        <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[0]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
        </div>

        <section>
          <h2>Programmable Logic Controllers (PLCs)</h2>
          <p>
            Programmable Logic Controllers (PLCs) are industrial computers, with various inputs and outputs, used to control and monitor industrial equipment based on custom programming. PLCs come in many different sizes and form factors. Some are small enough to fit in your pocket, while others are large enough to require their own heavy-duty racks to mount. Some PLCs are more modular, with only basic I/O (Inputs and Outputs), but can be customized with additional back planes and functional modules (such as analog I/O, communications modules, or display modules) to fit different types of industrial applications.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[1]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <h3>How Does a PLC Work?</h3>
          <p>
            A PLC&apos;s operation is broken down into three stages: inputs, program execution, and outputs. PLCs capture data from the plant floor by monitoring inputs from any connected machines or devices. These inputs are checked against the program logic, which changes the outputs to any connected output devices. It is possible to have the same machine connected to both inputs and outputs on the same PLC, such as a valve position sensor connected to the inputs with the control of that valve position connected to the outputs. A program could read the current position of that valve, check to see if it needs to move, then move the valve position with the output.
          </p>
          <p>
            PLCs often make a distinction between Digital (or Discrete) and Analog I/O. Digital I/O acts like a standard light switch where the state is either on or off, with no states between. Analog I/O acts like a dimmer switch, where the state can be anywhere between on and off.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[2]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <p>
            It is easy to think of there being two sources of input data for PLCs: Device input data, automatically generated by a machine or sensor, or User input data, generated by a human operator using an HMI or SCADA system.
          </p>
          <p>
            The Device input data comes from sensors and machines that send information to the PLC. This can include:
          </p>
          <ul>
            <li>On/Off states for things like mechanical switches and buttons</li>
            <li>Analog readings for things like speed, pressure, and temperature</li>
            <li>Opened/Closed states for things like pumps and valves</li>
          </ul>
          <p>
            Human-facilitated inputs can include button pushes, switches, sensors from devices like keyboards, touch screens, remotes, or card readers.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[3]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <p>
            PLC outputs are very similar to inputs, but can also include audible or visual indicators for the user, such as turning on a warning light, or sounding an alarm beacon. Other outputs can include:
          </p>
          <ul>
            <li>Opening or closing a valve</li>
            <li>Adjusting the speed on a motor</li>
            <li>Turning a heater On or Off</li>
          </ul>
          <p>
            PLC programs operate in cycles. First, the PLC detects the state of all input devices that are connected to it. The PLC executes the user-created program, using the state of the inputs to determine the state that the outputs should be changed to. The PLC then changes the output signals to each corresponding device. After completing all these steps, the PLC then does a housekeeping step, which includes an internal diagnostic safety check to ensure that everything is within normal operating conditions. The PLC restarts the cycle each time the process is completed, starting again by checking inputs.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[4]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <h3>What Are the Main Types of PLCs?</h3>
          <p>
            There are many kinds of PLCs but most fall into one of two main categories: fixed and modular. The main difference between the two is that fixed PLCs have a pre-built number of inputs and outputs, while modular PLCs are designed to be much more adaptable. Fixed and modular PLCs are useful for different purposes, with benefits ranging from portability and affordability to scalability and customizability.
          </p>
          <h4>Fixed PLCs</h4>
          <p>
            Fixed PLCs are the most common type of PLC. Fixed PLCs are smaller and more affordable than modular PLCs, which makes fixed PLCs a good choice for smaller or portable control systems or for performing standalone tasks. However, fixed PLCs are made with the processing unit, terminals, and input and output components wired internally, and they do not have as much memory as modular PLCs. This makes fixed PLCs harder to repair and modify, which could lead to increased downtime if you do not have backup PLCs.
          </p>
          <h4>Modular PLCs</h4>
          <p>
            Modular PLCs are more scalable and customizable, and easier to troubleshoot, than fixed PLCs, but modular PLCs are also larger and more expensive. Modular PLCs are best for expanding large-scale operations because you can easily add more input and output devices, improve processing units, upgrade memory, and more. This allows you to customize a modular PLC to increase functionality and do complex operations that would be impossible for a fixed PLC. Modular PLCs also reduce downtime because each module does a specific job, which makes it easier to isolate and fix faults while the working PLC modules continue to operate.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[5]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <h3>What Are the 5 Standard PLC Programming Languages?</h3>
          <p>
            PLCs are widely used in a variety of industries because they are fast, easy to operate, and considered easy to program. There are five standard PLC programming languages. The most commonly used language is Ladder Logic, but it is also possible to use Function Block Diagrams, Sequential Function Charts, Structured Text, or Instruction Lists to achieve the same functionality.
          </p>
          <h3>A PLC&apos;s Role in SCADA & HMI Systems</h3>
          <p>
            SCADA and HMI systems enable users to view data from the manufacturing floor and provide user interfaces for control and monitoring — and PLCs are an essential hardware component element in these systems. PLCs act as the physical interfaces between devices on the plant or manufacturing floor and a SCADA or HMI system. PLCs can communicate, monitor, and control complex automated processes such as conveyors, temperature control, robot cells, and many other industrial machines.
          </p>
        </section>
        <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[6]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
        </div>

        <section>
          <h2>Food Manufacturing</h2>
          <p>
            Food manufacturing is the process of turning raw agricultural materials into food products that people can consume. It involves various steps such as cleaning, processing, packaging, and distributing food items. Food manufacturing aims to create safe, healthy, and nutritious food products that meet the needs and preferences of consumers.
          </p>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[7]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <p>
            Food manufacturing is a complex and highly regulated industry that requires strict adherence to food safety and quality standards. Manufacturers must follow strict guidelines and regulations set by local and international authorities to ensure that the food they produce is safe for human consumption. This includes measures to prevent contamination, ensure proper labeling, and maintain proper hygiene and sanitation practices throughout the production process.
          </p>
          <h3>The Food Production Process</h3>
          <p>The exact processes of food production depend on the type of product being made. Generally, however, most businesses stick to the following 6 steps when it comes to creating products:</p>
          <ol>
            <li><strong>Raw material sourcing:</strong> The first step in food production is to source the raw materials needed to make the product. This can include sourcing ingredients from suppliers or growing crops on a farm.</li>
            <li><strong>Pre-processing:</strong> During this step, the materials are cleaned, sorted, and prepared for processing. This may involve washing, peeling, slicing, or other forms of preparation.</li>
            <li><strong>Processing:</strong> The raw materials are processed to create the final food product. This may involve cooking, baking, fermenting, or other methods depending on the type of food.</li>
            <li><strong>Packaging:</strong> Once the food is processed, it is packaged into containers or packaging that will protect it from contamination and extend its shelf life.</li>
            <li><strong>Quality control:</strong> During the production process, quality control measures are put in place to ensure that the food product meets certain standards for taste, texture, and nutritional content.</li>
            <li><strong>Distribution:</strong> The final step in the food production process is distributing the food product to retailers, wholesalers, or consumers.</li>
          </ol>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[8]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <p>
            Maintaining proper hygiene and sanitation practices throughout the food production process is crucial to prevent contamination and ensure food safety. This involves regular cleaning of equipment, proper storage of raw materials and finished products, and following strict food safety regulations and guidelines.
          </p>
          <h3>Food Manufacturing Industries</h3>
          <p>The food manufacturing industry encompasses a wide range of sectors that produce food and beverage products for consumption. Some of the major food manufacturing industries include:</p>
          <ul>
            <li>Meat processing</li>
            <li>Dairy products</li>
            <li>Baked goods</li>
            <li>Snack foods</li>
            <li>Beverages</li>
            <li>Confectionery</li>
            <li>Frozen foods</li>
            <li>Canned and preserved foods</li>
          </ul>
          <h3>Good Manufacturing Practices (GMPs)</h3>
          <p>
            GMPs (good manufacturing practices) are a set of guidelines used to ensure the safety, quality, and consistency of food products during the manufacturing process. These guidelines cover various aspects of food manufacturing, including equipment and facilities, personnel training, and production processes. Examples include:
          </p>
          <ul>
            <li><strong>Equipment and facilities:</strong> Equipment and facilities should be designed, constructed, and maintained in a way that prevents contamination and ensures the safety of the product.</li>
            <li><strong>Personnel training:</strong> Personnel should be trained on the proper handling of food products, hygiene practices, and safety procedures.</li>
            <li><strong>Production processes:</strong> Production processes should be well-defined, documented, and controlled to ensure consistency and quality.</li>
            <li><strong>Raw materials:</strong> Raw materials should be sourced from approved suppliers and inspected and tested for quality and safety before production.</li>
            <li><strong>Cleaning and sanitation:</strong> Equipment and facilities should be cleaned and sanitized regularly to prevent contamination.</li>
            <li><strong>Quality control:</strong> Quality control measures should be implemented to ensure the final product meets certain taste, texture, and nutritional content standards.</li>
            <li><strong>Recordkeeping:</strong> Accurate and complete records must be maintained to track the production process and ensure the traceability of the product.</li>
          </ul>
          <div className="hotdog-image-container">
            <Image src={hotDogImageUrls[9]} alt="Hot Dog" width={200} height={150} style={hotDogImageStyle} />
          </div>
          <h3>Food Manufacturing Technology</h3>
          <p>To leverage the benefits of food manufacturing and prevent its various drawbacks, companies are investing in the latest technology. These new tools enable brands to be more efficient and health-conscious. Some top digital solutions include:</p>
          <ul>
              <li><strong>Artificial Intelligence (AI) and Robotics:</strong> Used for repetitive tasks, maintaining quality, improving efficiency, and enhancing employee safety.</li>
              <li><strong>Automation:</strong> Streamlines repetitive tasks, improves speed, output volume, and accuracy. Often involves software solutions for tasks like food safety tracking.</li>
              <li><strong>Digital Twins:</strong> Simulating copies of systems for testing and analytics. Allows businesses to gain insights, forecast outcomes, and optimize product development and distribution.</li>
              <li><strong>Blockchain:</strong> Enhances traceability of products, showing origin, handling methods, and supply chain steps. Helps in tracking contamination and ensuring food safety and sustainability.</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default PLCInfoPage; 