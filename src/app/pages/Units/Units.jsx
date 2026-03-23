import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_UNIT, EDIT_UNIT, GET_UNITS, UPLOAD_UNIT_IMAGES, BLOCK_UNIT } from "./Api";
import { GET_PROJECTS } from "../Projects/Api";
import { useState } from "react";
import { useEffect } from "react";
import { ImageBaseUrl } from "app/services/config";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
// import UploadImageButton from "app/components/UploadImageButton/UploadImageButton";
// import { createRoot } from "react-dom/client";

const Units = () => {
  useTranslation(); // Not using any translation functions currently
  const [projects, setProjects] = useState([]);
  const [unitFiles] = useState([]); // setUnitFiles not used in current implementation
  const unitFilesRef = useRef([]);
  const currentEditRowId = useRef(null);
  const [blockDialogVisible, setBlockDialogVisible] = useState(false);
  const [selectedUnitForBlock, setSelectedUnitForBlock] = useState(null);
  const [blockUntilDate, setBlockUntilDate] = useState(null);

  // Full-screen image modal functions
  const showFullScreenImage = useCallback((imageSrc) => {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      cursor: pointer;
    `;

    // Create image container
    const imageContainer = document.createElement("div");
    imageContainer.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      position: relative;
    `;

    // Create image element
    const img = document.createElement("img");
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;
    img.src = imageSrc;
    img.alt = "Full screen image";

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "×";
    closeButton.style.cssText = `
      position: absolute;
      top: -15px;
      right: -15px;
      width: 40px;
      height: 40px;
      background: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 10001;
    `;

    // Close modal function
    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = "";
    };

    // Event listeners
    modal.addEventListener("click", closeModal);
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });

    // Prevent closing when clicking on image
    imageContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // ESC key to close
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Assemble modal
    imageContainer.appendChild(img);
    imageContainer.appendChild(closeButton);
    modal.appendChild(imageContainer);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Add to page
    document.body.appendChild(modal);
  }, []);

  // Utility functions to manage file state across re-renders
  const getStorageKey = useCallback(
    (rowId) => `unit_files_${rowId || "new"}`,
    []
  );

  const clearFilesFromStorage = useCallback(
    (rowId) => {
      try {
        sessionStorage.removeItem(getStorageKey(rowId));
        unitFilesRef.current = [];
      } catch (error) {
        console.warn("Could not clear files from storage:", error);
      }
    },
    [getStorageKey]
  );

  // Update ref whenever unitFiles changes
  useEffect(() => {
    unitFilesRef.current = unitFiles;
  }, [unitFiles]);

  // File handling functions (kept for potential future use)
  // const handleGetImages = useCallback((event) => {
  //   const files = Array.from(event.target.files);
  //   const newFiles = [...unitFilesRef.current, ...files];
  //   setUnitFiles(newFiles);
  //   unitFilesRef.current = newFiles;
  // }, []);

  // const handleRemoveImage = useCallback((index) => {
  //   const newFiles = unitFilesRef.current.filter((_, i) => i !== index);
  //   setUnitFiles(newFiles);
  //   unitFilesRef.current = newFiles;
  // }, []);

  // const handleRemoveAllImages = useCallback(() => {
  //   setUnitFiles([]);
  //   unitFilesRef.current = [];
  // }, []);

  // Handle saving with files
  const onRowInserting = useCallback((e) => {
    console.log("onRowInserting called with data:", e.data);
    // Get files from current ref
    const currentFiles = unitFilesRef.current;
    console.log("Files for insert:", currentFiles);
    if (currentFiles && currentFiles.length > 0) {
      e.data.Files = currentFiles;
      console.log("Added files to insert data");
    }
    // Convert numeric fields to numbers
    if (e.data.Price !== undefined && e.data.Price !== null) {
      e.data.Price = Number(e.data.Price);
    }
    if (e.data.GoldPrice !== undefined && e.data.GoldPrice !== null) {
      e.data.GoldPrice = Number(e.data.GoldPrice);
    }
    if (e.data.OuterArea !== undefined && e.data.OuterArea !== null) {
      e.data.OuterArea = Number(e.data.OuterArea);
    }
  }, []);

  const onRowUpdating = useCallback((e) => {
    console.log("onRowUpdating called with newData:", e.newData);
    console.log("onRowUpdating called with oldData:", e.oldData);
    
    // Start with ALL original data to preserve all backend fields (BUA, Bedrooms, Bathrooms, etc.)
    const fullData = { ...e.oldData };
    
    // Override with new data (only the fields that were actually changed)
    Object.keys(e.newData).forEach(key => {
      // Only update fields that are actually in newData and not null/undefined
      if (e.newData[key] !== null && e.newData[key] !== undefined) {
        fullData[key] = e.newData[key];
      }
    });
    
    // Ensure all required fields are present and properly formatted
    // Convert numeric fields to numbers
    if (fullData.Floor !== undefined && fullData.Floor !== null) {
      fullData.Floor = Number(fullData.Floor);
    }
    if (fullData.Area !== undefined && fullData.Area !== null) {
      fullData.Area = Number(fullData.Area);
    }
    if (fullData.OuterArea !== undefined && fullData.OuterArea !== null) {
      fullData.OuterArea = Number(fullData.OuterArea);
    }
    if (fullData.BUA !== undefined && fullData.BUA !== null) {
      fullData.BUA = Number(fullData.BUA);
    }
    if (fullData.Price !== undefined && fullData.Price !== null) {
      fullData.Price = Number(fullData.Price);
    }
    if (fullData.GoldPrice !== undefined && fullData.GoldPrice !== null) {
      fullData.GoldPrice = Number(fullData.GoldPrice);
    }
    if (fullData.UnitStatus !== undefined && fullData.UnitStatus !== null) {
      fullData.UnitStatus = Number(fullData.UnitStatus);
    }
    if (fullData.UnitType !== undefined && fullData.UnitType !== null) {
      fullData.UnitType = Number(fullData.UnitType);
    }
    if (fullData.ProjectId !== undefined && fullData.ProjectId !== null) {
      fullData.ProjectId = Number(fullData.ProjectId);
    }
    if (fullData.Bedrooms !== undefined && fullData.Bedrooms !== null) {
      fullData.Bedrooms = Number(fullData.Bedrooms);
    }
    if (fullData.Bathrooms !== undefined && fullData.Bathrooms !== null) {
      fullData.Bathrooms = Number(fullData.Bathrooms);
    }
    if (fullData.LivingRooms !== undefined && fullData.LivingRooms !== null) {
      fullData.LivingRooms = Number(fullData.LivingRooms);
    }
    if (fullData.Kitchen !== undefined && fullData.Kitchen !== null) {
      fullData.Kitchen = Number(fullData.Kitchen);
    }
    if (fullData.Balcony !== undefined && fullData.Balcony !== null) {
      fullData.Balcony = Number(fullData.Balcony);
    }
    
    // Ensure string fields are not null/undefined - use old data as fallback
    if (!fullData.UnitNumber || fullData.UnitNumber === '') {
      fullData.UnitNumber = e.oldData?.UnitNumber || '';
    } else {
      fullData.UnitNumber = String(fullData.UnitNumber);
    }
    if (!fullData.BuildingNumber || fullData.BuildingNumber === '') {
      fullData.BuildingNumber = e.oldData?.BuildingNumber || '';
    } else {
      fullData.BuildingNumber = String(fullData.BuildingNumber);
    }
    
    // Preserve other string fields
    if (fullData.View !== undefined) {
      fullData.View = String(fullData.View || 'null');
    }
    if (fullData.Furnishing !== undefined) {
      fullData.Furnishing = String(fullData.Furnishing || 'null');
    }
    if (fullData.LocationOnMap !== undefined) {
      fullData.LocationOnMap = String(fullData.LocationOnMap || '');
    }
    if (fullData.ImageMape !== undefined) {
      fullData.ImageMape = String(fullData.ImageMape || '0');
    }
    
    // Remove navigation properties that shouldn't be sent
    delete fullData.Project;
    delete fullData.Reservations;
    delete fullData.PaymentPlans;
    
    // Get files from current ref
    const currentFiles = unitFilesRef.current;
    console.log("Files for update:", currentFiles);
    if (currentFiles && currentFiles.length > 0) {
      fullData.Files = currentFiles;
      console.log("Added files to update data");
    } else {
      // Remove Files field if it's not a File object (server paths shouldn't be sent)
      if (fullData.Files && !Array.isArray(fullData.Files)) {
        delete fullData.Files;
      } else if (Array.isArray(fullData.Files) && fullData.Files.length > 0 && typeof fullData.Files[0] === 'string') {
        // If Files is an array of strings (server paths), remove it
        delete fullData.Files;
      }
    }
    
    // Replace e.newData with the full data
    e.newData = fullData;
    console.log("Full data being sent for update:", JSON.stringify(fullData, null, 2));
  }, []);

  // Editor preparation for file upload field
  const onEditorPreparing = useCallback((e) => {
    if (e.dataField === "Files") {
      // Hide the default text input
      e.editorElement.style.display = "none";

      // Get current value (existing files from server)
      const currentValue = e.value;
      console.log("onEditorPreparing - Current files value:", currentValue);

      // Create container for file upload button and existing images
      const container = document.createElement("div");
      e.editorElement.parentNode.appendChild(container);

      // Parse existing files
      let existingFiles = [];
      if (typeof currentValue === "string" && currentValue.trim() !== "") {
        existingFiles = [currentValue];
      } else if (Array.isArray(currentValue) && currentValue.length > 0) {
        existingFiles = currentValue;
      }

      // Create the initial HTML structure
      container.innerHTML = `
          <div style="padding: 10px;">
          <div class="existing-images" style="margin-bottom: 10px;"></div>
          <button type="button" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Upload Files</button>
            <div class="file-list" style="margin-top: 5px; font-size: 12px; color: #666;"></div>
          </div>
        `;

      // Display existing files (images and PDFs)
      const existingImagesDiv = container.querySelector(".existing-images");
      if (existingFiles.length > 0) {
        existingImagesDiv.innerHTML =
          '<div style="font-size: 12px; color: #333; margin-bottom: 5px;">Current Files:</div>';
        const filesContainer = document.createElement("div");
        filesContainer.style.cssText =
          "display: flex; flex-wrap: wrap; gap: 8px;";

        existingFiles.forEach((filePath, index) => {
          const fileDiv = document.createElement("div");
          fileDiv.style.cssText =
            "position: relative; display: inline-block; cursor: pointer; transition: transform 0.2s;";

          // Check if file is a PDF
          const isPdf = filePath.toLowerCase().endsWith('.pdf') || 
                       filePath.toLowerCase().includes('.pdf') ||
                       filePath.toLowerCase().includes('application/pdf');
          
          // Check if file is an image
          const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(filePath);

          if (isPdf) {
            // Create PDF icon
            const pdfIcon = document.createElement("div");
            pdfIcon.style.cssText =
              "width: 60px; height: 60px; background: #dc3545; border-radius: 4px; border: 2px solid #ddd; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; text-align: center; padding: 4px;";
            pdfIcon.innerHTML = "PDF";
            pdfIcon.title = filePath;

            // Add hover effect
            fileDiv.addEventListener("mouseenter", () => {
              fileDiv.style.transform = "scale(1.05)";
            });
            fileDiv.addEventListener("mouseleave", () => {
              fileDiv.style.transform = "scale(1)";
            });

            // Add click handler to open PDF in new tab
            fileDiv.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              const fullFileSrc = filePath.startsWith("http")
                ? filePath
                : ImageBaseUrl + filePath;
              window.open(fullFileSrc, '_blank');
            });

            fileDiv.appendChild(pdfIcon);
          } else if (isImage) {
            // Create image element
            const img = document.createElement("img");
            img.style.cssText =
              "width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 2px solid #ddd;";
            img.alt = `Existing file ${index + 1}`;
            const fullImageSrc = filePath.startsWith("http")
              ? filePath
              : ImageBaseUrl + filePath;
            img.src = fullImageSrc;

            // Add hover effect
            fileDiv.addEventListener("mouseenter", () => {
              fileDiv.style.transform = "scale(1.05)";
            });
            fileDiv.addEventListener("mouseleave", () => {
              fileDiv.style.transform = "scale(1)";
            });

            // Add click handler for full-screen view
            fileDiv.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              showFullScreenImage(fullImageSrc);
            });

            // Add error handling for existing images
            img.onerror = () => {
              img.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzMkMzMS42IDMyIDMzIDMwLjYgMzMgMjlDMzMgMjcuNCAzMS42IDI2IDMwIDI2QzI4LjQgMjYgMjcgMjcuNCAyNyAyOUMyNyAzMC42IDI4LjQgMzIgMzAgMzJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xOCAyMVYzOUg0MlYyMUgxOFpNMzkgMzZIMjFWMjRIMzlWMzZaIiBmaWxsPSIjOTk5Ii8+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+";
            };

            fileDiv.appendChild(img);
          } else {
            // Create generic file icon for other file types
            const fileIcon = document.createElement("div");
            const fileExtension = filePath.split('.').pop()?.toUpperCase() || 'FILE';
            fileIcon.style.cssText =
              "width: 60px; height: 60px; background: #6c757d; border-radius: 4px; border: 2px solid #ddd; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 9px; text-align: center; padding: 4px;";
            fileIcon.innerHTML = fileExtension.length > 4 ? fileExtension.substring(0, 4) : fileExtension;
            fileIcon.title = filePath;

            // Add hover effect
            fileDiv.addEventListener("mouseenter", () => {
              fileDiv.style.transform = "scale(1.05)";
            });
            fileDiv.addEventListener("mouseleave", () => {
              fileDiv.style.transform = "scale(1)";
            });

            // Add click handler to open file in new tab
            fileDiv.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              const fullFileSrc = filePath.startsWith("http")
                ? filePath
                : ImageBaseUrl + filePath;
              window.open(fullFileSrc, '_blank');
            });

            fileDiv.appendChild(fileIcon);
          }

          filesContainer.appendChild(fileDiv);
        });

        existingImagesDiv.appendChild(filesContainer);
      }

      // Create hidden file input
      const button = container.querySelector("button");
      const fileListDiv = container.querySelector(".file-list");
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true;
      // Accept any file type (images, PDFs, and other files)
      fileInput.style.display = "none";
      container.appendChild(fileInput);

      // Create a hidden trigger input that we'll use to force form dirty state
      const triggerInput = document.createElement("input");
      triggerInput.type = "hidden";
      triggerInput.name = "filesTrigger";
      triggerInput.style.display = "none";
      e.editorElement.parentNode.appendChild(triggerInput);

      // Handle file selection
      button.onclick = () => fileInput.click();
      fileInput.onchange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
          // Check if we're in update mode (editing existing unit)
          const isUpdateMode =
            currentEditRowId.current && currentEditRowId.current > 0;

          // Update button and display
          button.textContent = `${files.length} new file(s) selected`;
          fileListDiv.innerHTML = `
            <div style="margin-top: 5px;">
              <strong>New files selected:</strong><br>
              ${files.map((f) => `• ${f.name}`).join("<br>")}
            </div>
          `;

          // If in update mode, upload immediately
          if (isUpdateMode) {
            button.textContent = "Uploading...";
            button.disabled = true;

            try {
              console.log(
                "Uploading images for unit:",
                currentEditRowId.current
              );
              const response = await UPLOAD_UNIT_IMAGES(
                currentEditRowId.current,
                files
              );
              console.log("Upload response:", response);

              button.textContent = "Upload Successful!";
              button.style.background = "#28a745";
              fileListDiv.innerHTML = `
                <div style="margin-top: 5px; color: #28a745;">
                  <strong>✓ ${files.length} file(s) uploaded successfully!</strong>
                </div>
              `;

              // Reset button after 2 seconds
              setTimeout(() => {
                button.textContent = "Upload Files";
                button.style.background = "#007bff";
                button.disabled = false;
              }, 2000);
            } catch (error) {
              console.error("Upload failed:", error);
              button.textContent = "Upload Failed";
              button.style.background = "#dc3545";
              fileListDiv.innerHTML = `
                <div style="margin-top: 5px; color: #dc3545;">
                  <strong>✗ Upload failed. Please try again.</strong>
                </div>
              `;

              // Reset button after 3 seconds
              setTimeout(() => {
                button.textContent = "Upload Files";
                button.style.background = "#007bff";
                button.disabled = false;
              }, 3000);
            }
          } else {
            // Store files in ref for later use during save (for new units)
            unitFilesRef.current = files;

            // Update the hidden trigger input to force form dirty state
            if (triggerInput) {
              triggerInput.value = Date.now().toString(); // Use timestamp to ensure it's different
              const triggerEvent = new Event("change", { bubbles: true });
              triggerInput.dispatchEvent(triggerEvent);
            }

            // Update the editor element's value to trigger change detection
            if (e.editorElement) {
              e.editorElement.value = `${files.length} file(s) selected`;

              // Mark the element as modified to trigger DevExtreme validation
              e.editorElement.setAttribute("data-modified", "true");

              // Create and dispatch multiple events to ensure form recognizes the change
              const inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true,
              });
              const changeEvent = new Event("change", {
                bubbles: true,
                cancelable: true,
              });
              const focusEvent = new Event("focus", { bubbles: true });
              const blurEvent = new Event("blur", { bubbles: true });

              // Simulate user interaction
              e.editorElement.dispatchEvent(focusEvent);
              e.editorElement.dispatchEvent(inputEvent);
              e.editorElement.dispatchEvent(changeEvent);
              e.editorElement.dispatchEvent(blurEvent);

              // Force focus and blur to ensure DevExtreme recognizes the change
              e.editorElement.focus();
              setTimeout(() => {
                e.editorElement.blur();
              }, 10);
            }

            // Force the form to be dirty by accessing the form component directly (only for new units)
            if (e.component && e.component.element) {
              // Find the form component in the DOM hierarchy
              let formElement = e.component.element().closest(".dx-form");
              if (formElement) {
                // Try to find the DevExtreme form instance
                const formInstance =
                  formElement &&
                  formElement.dxForm &&
                  formElement.dxForm("instance");
                if (formInstance) {
                  // Force the form to be dirty
                  formInstance._setOptionWithoutOptionChange("isDirty", true);
                  console.log("Form marked as dirty");
                }
              }
            }

            // Also try to update through DevExtreme's component options
            if (e.component && e.component.option) {
              try {
                e.component.option("formData.Files", files);
                // Try to mark the component as modified
                if (e.component.option("isDirty") !== undefined) {
                  e.component.option("isDirty", true);
                }

                // Try to trigger validation on the specific field
                if (e.component.validate) {
                  e.component.validate();
                }

                // Force the editor to show as modified
                if (
                  e.component.option &&
                  e.component.option("isValid") !== undefined
                ) {
                  e.component.option("isValid", true);
                }
              } catch (error) {
                console.log("Could not update component options:", error);
              }
            }

            // Try a more direct approach - find and update the form field directly
            setTimeout(() => {
              try {
                const formElement = document.querySelector(".dx-form");
                if (formElement) {
                  const filesField = formElement.querySelector(
                    '[data-field="Files"]'
                  );
                  if (filesField) {
                    const textBox = filesField.querySelector(".dx-textbox");
                    if (textBox && textBox.dxTextBox) {
                      const textBoxInstance = textBox.dxTextBox("instance");
                      if (textBoxInstance) {
                        textBoxInstance.option(
                          "value",
                          `${files.length} file(s) selected`
                        );
                        textBoxInstance._valueChangeAction({
                          value: `${files.length} file(s) selected`,
                        });
                      }
                    }
                  }
                }
              } catch (error) {
                console.log("Could not update form field directly:", error);
              }
            }, 50);

            // Try to access the parent grid/form and mark it as having changes
            if (e.component && e.component._parentGrid) {
              try {
                e.component._parentGrid.hasChanges(true);
              } catch (error) {
                console.log("Could not mark parent grid as changed:", error);
              }
            }

            // Update the FilesChangeTracker field to trigger form dirty state
            try {
              if (e.component && e.component.option) {
                const timestamp = Date.now().toString();
                e.component.option("formData.FilesChangeTracker", timestamp);
                console.log("Updated FilesChangeTracker to:", timestamp);
              }
            } catch (error) {
              console.log("Could not update FilesChangeTracker:", error);
            }

            console.log("Files selected and stored:", files);
          }
        }
      };

      // Initialize with existing files if no new files are selected
      if (existingFiles.length > 0) {
        fileListDiv.innerHTML = `<div style="color: #666;">Currently: ${existingFiles.length} file(s) from server</div>`;
      }
    }
  }, []);

  // Stable cellTemplate function for Files column - displays first image
  const filesCellTemplate = useCallback((container, options) => {
    const files = options.value;

    // Debug logging
    console.log("filesCellTemplate - Raw files data:", files);
    console.log("filesCellTemplate - files type:", typeof files);

    // Clear container
    container.innerHTML = "";

    // Handle different data formats
    let filesList = [];
    if (typeof files === "string" && files.trim() !== "") {
      // Single file path as string
      filesList = [files];
    } else if (Array.isArray(files) && files.length > 0) {
      // Array of files
      filesList = files;
    }

    if (filesList.length > 0) {
      // Create container div
      const imageContainer = document.createElement("div");
      imageContainer.style.cssText =
        "display: flex; align-items: center; gap: 8px;";

      // Get first file
      const firstFile = filesList[0];

      // Create image element
      const img = document.createElement("img");
      img.style.cssText =
        "width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; cursor: pointer; transition: transform 0.2s;";
      img.alt = "Unit image";

      let fullImageSrc = "";

      // Check file type
      const fileName = typeof firstFile === "string" 
        ? firstFile 
        : (firstFile?.name || "");
      const isPdf = fileName.toLowerCase().endsWith('.pdf') || 
                    fileName.toLowerCase().includes('.pdf') ||
                    fileName.toLowerCase().includes('application/pdf');
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);

      if (isPdf) {
        // Replace image with PDF icon
        imageContainer.innerHTML = "";
        const pdfIcon = document.createElement("div");
        pdfIcon.style.cssText =
          "width: 40px; height: 40px; background: #dc3545; border-radius: 4px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 8px; text-align: center; cursor: pointer; transition: transform 0.2s;";
        pdfIcon.textContent = "PDF";

        // Add hover effect
        pdfIcon.addEventListener("mouseenter", () => {
          pdfIcon.style.transform = "scale(1.1)";
        });
        pdfIcon.addEventListener("mouseleave", () => {
          pdfIcon.style.transform = "scale(1)";
        });

        // Add click handler to open PDF in new tab
        pdfIcon.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const fullFileSrc = typeof firstFile === "string"
            ? (firstFile.startsWith("http") ? firstFile : ImageBaseUrl + firstFile)
            : URL.createObjectURL(firstFile);
          window.open(fullFileSrc, '_blank');
        });

        imageContainer.appendChild(pdfIcon);
      } else if (isImage) {
        // Handle different file sources for images
        if (typeof firstFile === "string") {
          // File is a URL/path string from server
          fullImageSrc = firstFile.startsWith("http")
            ? firstFile
            : ImageBaseUrl + firstFile;
          img.src = fullImageSrc;
          console.log(img.src);
        } else if (firstFile && firstFile.name) {
          // File is a File object - create object URL
          fullImageSrc = URL.createObjectURL(firstFile);
          img.src = fullImageSrc;

          // Clean up object URL when image loads or errors
          img.onload = () => URL.revokeObjectURL(img.src);
          img.onerror = () => {
            URL.revokeObjectURL(img.src);
            img.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMkMyMS4xIDIyIDIyIDIxLjEgMjIgMjBDMjIgMTguOSAyMS4xIDE4IDIwIDE4QzE4LjkgMTggMTggMTguOSAxOCAyMEMxOCAyMS4xIDE4LjkgMjIgMjAgMjJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNFYyNkgyOFYxNEgxMlpNMjYgMjRIMTRWMTZIMjZWMjRaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=";
          };
        }
      } else {
        // Replace image with generic file icon for other file types
        imageContainer.innerHTML = "";
        const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
        const fileIcon = document.createElement("div");
        fileIcon.style.cssText =
          "width: 40px; height: 40px; background: #6c757d; border-radius: 4px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 7px; text-align: center; cursor: pointer; transition: transform 0.2s;";
        fileIcon.textContent = fileExtension.length > 4 ? fileExtension.substring(0, 4) : fileExtension;

        // Add hover effect
        fileIcon.addEventListener("mouseenter", () => {
          fileIcon.style.transform = "scale(1.1)";
        });
        fileIcon.addEventListener("mouseleave", () => {
          fileIcon.style.transform = "scale(1)";
        });

        // Add click handler to open file in new tab
        fileIcon.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const fullFileSrc = typeof firstFile === "string"
            ? (firstFile.startsWith("http") ? firstFile : ImageBaseUrl + firstFile)
            : URL.createObjectURL(firstFile);
          window.open(fullFileSrc, '_blank');
        });

        imageContainer.appendChild(fileIcon);
      }

      if (!isPdf) {
        // Add hover effect for images
        img.addEventListener("mouseenter", () => {
          img.style.transform = "scale(1.1)";
        });
        img.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1)";
        });

        // Add click handler for full-screen view
        img.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          showFullScreenImage(fullImageSrc);
        });

        // Add error handling
        img.onerror = () => {
          img.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMkMyMS4xIDIyIDIyIDIxLjEgMjIgMjBDMjIgMTguOSAyMS4xIDE4IDIwIDE4QzE4LjkgMTggMTggMTguOSAxOCAyMEMxOCAyMS4xIDE4LjkgMjIgMjAgMjJaIiBmaWxsPSIjOTk5Ii8+CjxwYXRoIGQ9Ik0xMiAxNFYyNkgyOFYxNEgxMlpNMjYgMjRIMTRWMTZIMjZWMjRaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=";
        };

        // Append image to container
        imageContainer.appendChild(img);
      }

      // Create text element for file count
      const textSpan = document.createElement("span");
      textSpan.style.cssText = "font-size: 12px; color: #666;";
      textSpan.textContent =
        filesList.length === 1 ? "1 file" : `${filesList.length} files`;

      // Append text span
      imageContainer.appendChild(textSpan);
      container.appendChild(imageContainer);
    } else {
      // No files - show placeholder
      const placeholder = document.createElement("div");
      placeholder.style.cssText =
        "display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; color: #999;";
      placeholder.textContent = "No image";
      container.appendChild(placeholder);
    }
  }, []);

  // Handle saving with files attached
  const onSaving = useCallback((e) => {
    console.log("onSaving called - form is being saved", e);
    // Don't modify anything for now - just log
  }, []);

  // Block unit handlers
  const handleBlockClick = useCallback((rowData) => {
    setSelectedUnitForBlock(rowData);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0); // Set to noon
    setBlockUntilDate(tomorrow);
    setBlockDialogVisible(true);
  }, []);

  const handleBlockConfirm = useCallback(async () => {
    if (!selectedUnitForBlock || !blockUntilDate) {
      notify("Please select a date and time", "error", 3000);
      return;
    }

    // Validate date is in the future
    const now = new Date();
    if (blockUntilDate <= now) {
      notify("Block date must be in the future", "error", 3000);
      return;
    }

    // Convert to UTC ISO string
    const blockedUntilUtc = blockUntilDate.toISOString();

    try {
      await BLOCK_UNIT(selectedUnitForBlock.Id, blockedUntilUtc);
      notify(`Unit ${selectedUnitForBlock.UnitNumber} blocked successfully`, "success", 3000);
      setBlockDialogVisible(false);
      setSelectedUnitForBlock(null);
      setBlockUntilDate(null);
      
      // Note: Grid will refresh on next interaction or user can use refresh button
    } catch (error) {
      console.error("Block unit error:", error);
      const errorMessage = error?.message || error?.error || "Failed to block unit";
      notify(errorMessage, "error", 5000);
    }
  }, [selectedUnitForBlock, blockUntilDate]);

  const handleBlockCancel = useCallback(() => {
    setBlockDialogVisible(false);
    setSelectedUnitForBlock(null);
    setBlockUntilDate(null);
  }, []);

  // Block button cell template
  const blockButtonCellTemplate = useCallback((container, options) => {
    container.innerHTML = "";
    const isAvailable = options.data?.UnitStatus === 0;
    const button = document.createElement("button");
    button.textContent = "Block";
    button.disabled = !isAvailable;
    button.style.cssText = `
      padding: 4px 12px;
      background: ${isAvailable ? "#dc3545" : "#ccc"};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: ${isAvailable ? "pointer" : "not-allowed"};
      font-size: 12px;
      transition: background 0.2s;
      opacity: ${isAvailable ? "1" : "0.6"};
    `;
    if (isAvailable) {
      button.addEventListener("mouseenter", () => {
        button.style.background = "#c82333";
      });
      button.addEventListener("mouseleave", () => {
        button.style.background = "#dc3545";
      });
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBlockClick(options.data);
      });
    }
    container.appendChild(button);
  }, [handleBlockClick]);

  useEffect(() => {
    GET_PROJECTS({ pageSize: 1000, pageIndex: 0 })
      .then((res) => {
        setProjects(res.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        captionEn: "Id",
        field: "Id",
        required: false,
        disable: true,
      },
      {
        caption: "Unit Number",
        captionEn: "Unit Number",
        field: "UnitNumber",
        required: true,
      },
      {
        caption: "Floor",
        captionEn: "Floor",
        field: "Floor",
        required: true,
        type: "number",
      },
      {
        caption: "Area",
        captionEn: "Area",
        field: "Area",
        required: true,
        type: "number",
      },
      {
        caption: "Outer Area",
        captionEn: "Outer Area",
        field: "OuterArea",
        required: false,
        type: "number",
      },
      {
        caption: "Building Number",
        captionEn: "Building Number",
        field: "BuildingNumber",
        required: true,
      },
      {
        caption: "Price",
        captionEn: "Price",
        field: "Price",
        required: true,
        type: "number",
      },
      {
        caption: "Gold Price",
        captionEn: "Gold Price",
        field: "GoldPrice",
        required: false,
        type: "number",
      },
      {
        caption: "Status",
        captionEn: "Status",
        field: "UnitStatus",
        required: true,
        type: "select",
        data: [
          { Id: 0, CategoryName: "Available" },
          { Id: 1, CategoryName: "Reserved" },
          { Id: 2, CategoryName: "Sold" },
          { Id: 3, CategoryName: "Blocked" },
        ],
        value: "Id",
        display: "CategoryName",
      },
      {
        caption: "Blocked Until",
        captionEn: "Blocked Until",
        field: "BlockedUntil",
        required: false,
        type: "datetime",
        disable: true,
      },
      {
        caption: "Unit Type",
        captionEn: "Unit Type",
        field: "UnitType",
        required: true,
        type: "select",
        data: [
          { Id: 0, CategoryName: "Office" },
          { Id: 1, CategoryName: "Clinic" },
          { Id: 2, CategoryName: "Shop" },
          { Id: 3, CategoryName: "Hotel Apartment" },
        ],
        value: "Id",
        display: "CategoryName",
      },
      {
        caption: "Project",
        captionEn: "Project",
        field: "ProjectId",
        required: true,
        type: "select",
        data: projects, // This will be populated from the API
        value: "Id",
        display: "Name",
      },
      // {
      //   caption: "Location On Map",
      //   captionEn: "Location On Map",
      //   field: "LocationOnMap",
      //   required: false,
      //   type: "text",
      // },
      // {
      //   caption: "Image Map",
      //   captionEn: "Image Map",
      //   field: "ImageMape",
      //   required: false,
      //   type: "text",
      // },
      {
        caption: "Files",
        captionEn: "Files",
        field: "Files",
        disable: true,
        isVisable: false,
        type: "text", // Use text type to avoid DevExtreme file handling issues
        allowEditing: true,
        cellTemplate: filesCellTemplate,
      },
      {
        caption: "Actions",
        captionEn: "Actions",
        field: "Block",
        disable: true,
        allowEditing: false,
        cellTemplate: blockButtonCellTemplate,
        widthRatio: 100,
      },
      // {
      //   caption: "Created At",
      //   captionEn: "Created At",
      //   field: "CreatedAt",
      //   required: false,
      //   type: "datetime",
      //   disable: true,
      // },
      // {
      //   caption: "Updated At",
      //   captionEn: "Updated At",
      //   field: "UpdatedAt",
      //   required: false,
      //   type: "datetime",
      //   disable: true,
      // }
    ];
  }, [projects, filesCellTemplate, showFullScreenImage, blockButtonCellTemplate]);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_UNIT}
        ADD={EDIT_UNIT}
        DELETE={DELETE_UNIT}
        GET={GET_UNITS}
        apiKey={"Id"}
        onEditorPreparing={onEditorPreparing}
        onRowInserting={onRowInserting}
        onRowUpdating={onRowUpdating}
        // onSaving={onSaving}
        onInitNewRow={() => {
          // Clear any existing file storage when starting a new row
          clearFilesFromStorage(null);
          unitFilesRef.current = [];
          currentEditRowId.current = null;
        }}
        onEditingStart={(e) => {
          // Track which row is being edited
          currentEditRowId.current = e.data.Id;
          console.log("Started editing row:", e.data.Id);
        }}
      />
      <Popup
        maxWidth={500}
        title="Block Unit"
        minWidth={300}
        minHeight={200}
        height={300}
        width={450}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={blockDialogVisible}
        onHiding={handleBlockCancel}
      >
        <div style={{ padding: "20px" }}>
          {selectedUnitForBlock && (
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Unit Number:</strong> {selectedUnitForBlock.UnitNumber}
              </p>
              <p>
                <strong>Building:</strong> {selectedUnitForBlock.BuildingNumber}
              </p>
            </div>
          )}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Block Until (UTC):
            </label>
            <DateBox
              value={blockUntilDate}
              onValueChanged={(e) => setBlockUntilDate(e.value)}
              type="datetime"
              displayFormat="yyyy-MM-dd HH:mm"
              min={new Date()}
              showClearButton={true}
              width="100%"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              text="Cancel"
              icon="close"
              type="normal"
              width={100}
              onClick={handleBlockCancel}
            />
            <Button
              text="Block Unit"
              icon="block"
              type="danger"
              width={120}
              onClick={handleBlockConfirm}
            />
          </div>
        </div>
      </Popup>
    </PageLayout>
  );
};

export default Units;
