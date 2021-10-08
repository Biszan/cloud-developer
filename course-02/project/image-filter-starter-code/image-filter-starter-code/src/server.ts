import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query

    // Assign route
    app.use('/filteredimage', async (req, res, next) => {
        //const filters = req.query;

        // destruct our path params
        let { image_url } = req.query;

        console.log(image_url);
        //console.log(filters);

  //    1. validate the image_url query
        if (!image_url) {
            // respond with an error if not
            return res.status(400).send(`image_url is required`);
        }

        //    2. call filterImageFromURL(image_url) to filter the image
        // try to find the image path
        const image_path = filterImageFromURL(image_url);

        // respond not found, if we do not have this image path
        if (image_path && (await image_path).length==0) {
            return res.status(404).send(`image not found`);
        }

        //    3. send the resulting file in the response
        //return the image with a sucess status code
        res.status(200).sendFile(await image_path);

  //    4. deletes any files on the server on finish of the response
        // Delete the image from the filesystem
        let fs = require('fs');

        let fileNameWithPath = image_path;
        console.log(fileNameWithPath);

        if (fs.existsSync(fileNameWithPath)) {
            fs.unlink(fileNameWithPath, (err: any) => {
                console.log(err);
            });
        }

    });

  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();