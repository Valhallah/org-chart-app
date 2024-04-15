
# Welcome to The Orgchart

This little data vizualization project takes in the given data and renders an org chart with the available data relative to the closest updated information.

## Let's Get started
Go ahead and pull down the repo and install the node modules with `yarn install` or `yarn`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Running this script should open the application in your default browser and you should see the Org Chart

# React Flow

  [https://reactflow.dev/learn](https://reactflow.dev/learn)

May not have been the beeest idea to pick a library I've never used before for a timed assignment but I really wanted to show a flow chart for this. It wasn't difficult to use! Getting the "backend" to filter the data is probably what I spent the most time on

I would also add a guided tour library to this like react-joyride so anyone new could see the steps layed out on the page.

## How it works

- Select a date
  - You can use the DateSlider to adjust the year you'd like to view
  - You can use the DatePicker to select a specific sate
- Click on a node to highlight it for easier viewing
- Click on an edge to highlight the path from the given jobId to the managerId
  
### Controls

The control panel in the bottom right corner this is how you can control the view

- Click the **+** button to zoom in
- Click the **-** button to zoom out
- Click the window button to reorient the view back to how it started
- Hovering over any of the buttons will render a tooltip for instruction

### MiniMap

In the bottom left corner of the org chart you will find a MiniMap with the basic layout of the chart

- Clicking and dragging the window inside the MiniMap will move the chart in the same way to focus on specific nodes in the chart

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
