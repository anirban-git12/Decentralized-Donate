import { useState } from "react";
import { uploadToPinata } from '../utils/pinataUpload'; // adjust the path if necessary

function CreateProjectComponent(props) {
  const [formInput, setFormInput] = useState({
    category: "",
    projectName: "",
    description: "",
    creatorName: "",
    image: "",
    link: "",
    goal: 0.00001,
    duration: 1,
    refundPolicy: "",
  });


  const [inputImage, setInputImage] = useState(null);

  // set the form input state if input changes
  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setFormInput({ ...formInput, [name]: value });
  }

  // read the input image file provided and set its corresponding state
  async function handleImageChange(e) {
    setInputImage(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  // return category code
  function getCategoryCode() {
    let categoryCode = {
      "design and tech": 0,
      film: 1,
      arts: 2,
      games: 3,
    };
    return categoryCode[formInput["category"]];
  }

  // return refund policy code
  function getRefundPolicyCode() {
    let refundCode = {
      refundable: 0,
      "non-refundable": 1,
    };
    return refundCode[formInput["refundPolicy"]];
  }

  // submit the form input data to smart contract
  async function submitProjectData(e) {
    e.preventDefault();
    if (inputImage) {
      try {
        console.log("InputImages", inputImage);
        const result = await uploadToPinata(inputImage);
        formInput["image"] = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      } catch (error) {
        alert("Uploading file error: " + error);
        console.log(error);
        return;
      }
    }

    // check for double submit
    if (!Number.isInteger(formInput["category"])) {
      formInput["category"] = getCategoryCode();
    }
    if (!Number.isInteger(formInput["refundPolicy"])) {
      formInput["refundPolicy"] = getRefundPolicyCode();
    }

    formInput["duration"] = parseFloat(formInput["duration"]);
    formInput["goal"] = parseFloat(formInput["goal"]);

    console.log(formInput);

    // upload form data to contract
    let txn;
    try {
      txn = await props.contract.createNewProject(
        formInput["projectName"],
        formInput["description"],
        formInput["creatorName"],
        formInput["link"],
        formInput["image"],
        formInput["goal"],
        formInput["duration"],
        formInput["category"],
        formInput["refundPolicy"]
      );

      await txn.wait(txn);
      alert("Project creation complete!!");
      document.getElementsByName("projectForm")[0].reset();
      return false;
    } catch (error) {
      alert("Error on calling function: " + error);
      console.log(error);
    }
  }

  return (
    <div className="create-form">
      <form method="post" onSubmit={submitProjectData} name="projectForm">
        <h1>Create Project</h1>
        <label>Category</label>
        <select name="category" required onChange={handleChange}>
          <option value="" selected disabled hidden>
            Select category
          </option>
          <option value="design and tech">Design and Tech</option>
          <option value="film">Film</option>
          <option value="arts">Arts</option>
          <option value="games">Games</option>
        </select>
        <label>Project Name</label>
        <input
          name="projectName"
          placeholder="Enter the project name"
          required
          onChange={handleChange}
        />
        <label>Project Description</label>
        <textarea
          name="description"
          placeholder="Enter project description"
          cols="50"
          rows="5"
          required
          onChange={handleChange}
        />
        <label>Creator Name</label>
        <input
          name="creatorName"
          placeholder="Enter Creator Name"
          required
          onChange={handleChange}
        />
        <label>Upload Project Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        
        <label>Project Link</label>
        <input
          type="url"
          name="link"
          placeholder="Enter link to the project"
          onChange={handleChange}
        />
        <label>Funding Goal (LineaETH)</label>
        <input
          type="number"
          step="1"
          name="goal"
          placeholder="Enter the funding goal"
          min="1"
          required
          onChange={handleChange}
        />
        <label>Duration (Minutes)</label>
        <input
          type="number"
          name="duration"
          placeholder="Enter the duration for the funding"
          min="1"
          required
          onChange={handleChange}
        />
        <label>Refund policy</label>
        <select name="refundPolicy" required onChange={handleChange}>
          <option value="" selected disabled hidden>
            Select Refund type
          </option>
          <option value="refundable">Refundable</option>
          <option value="non-refundable">Non-Refundable</option>
        </select>
        <input type="submit" className="submitButton" value="Submit" />
      </form>
    </div>
  );
}

export default CreateProjectComponent;
