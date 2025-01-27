//function to check for fields that falls outside of the schema of requesting route
export const validateRequest = (schema) => (req, res, next) => {
    const validKeys = Object.keys(schema.paths).filter((keys)=>!keys.startsWith("_"));; // Extract valid schema keys
    
    // Initialize BFS for request body keys
    const requestBody = req.body;
    let requestKeys = []; // Collect all keys found in request body
    let queue = [{ current: requestBody, path: '' }];
    
    while (queue.length > 0) {
      let { current, path } = queue.shift(); // Dequeue the first element
  
      for (let key in current) {
        if (current.hasOwnProperty(key)) {
          // Build the full path for nested keys
          let newPath = path ? `${path}.${key}` : key;
  
          if (
            typeof current[key] === 'object' &&
            current[key] !== null &&
            !Array.isArray(current[key])
          ) {
            // If value is an object, enqueue it for further exploration
            queue.push({ current: current[key], path: newPath });
          } else {
            // Otherwise, add the key to the request keys list
            requestKeys.push(newPath);
          }
        }
      }
    }
  
    // Check for invalid keys (not in the schema)
    const invalidKeys = requestKeys.filter((key) => !validKeys.includes(key));
    
    if (invalidKeys.length > 0) {
      return res.status(400).json({
        error: `Invalid keys in request: ${invalidKeys.join(', ')}`, // Return invalid keys
      });
    }
  
    next(); // Continue to the next middleware
  };

export const checkRequiredKeys = (key, keyName, res) =>{
    if(!key){
        res.status(400).json({error: `Request body must contain key ${keyName}`})
        return false;
    }
    return true;
  }
  