# Bear Management System

A modern Angular application for managing bears with their colors and sizes. Built with Angular 17, using standalone components, signals, and reactive forms.

## Features

- **Add New Bears**: Fill out a form to add bears with name, size, and colors
- **Color Selection**: Choose from available colors loaded from the backend API
- **Bear List**: View all bears in a responsive grid layout
- **Filter by Color**: Filter bears using a dropdown of available colors
- **Real-time Updates**: Bears list updates automatically when new bears are added
- **Modern UI**: Clean, responsive design with smooth animations

## Technical Stack

- **Angular 17**: Latest version with standalone components
- **Signals**: Used for reactive state management
- **Reactive Forms**: For form handling and validation
- **HttpClient**: For API communication
- **SCSS**: For styling with modern CSS features
- **Jasmine/Karma**: For unit testing

## Architecture

### Components
- `BearFormComponent`: Handles bear creation with form validation
- `BearListComponent`: Displays bears and provides filtering functionality

### Services
- `BearService`: Manages bear-related API calls and state
- `ColorService`: Manages color-related API calls and state

### Models
- `Bear`: Interface for bear data structure
- `Color`: Interface for color data structure
- `CreateBearRequest`: Interface for bear creation requests

## API Endpoints

The application communicates with a backend server running on `localhost:3000`:

- `GET /color` - Get all available colors
- `GET /bear` - Get all bears
- `POST /bear` - Create a new bear
- `GET /bear/search?colorIds=1,2` - Search bears by color IDs

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Angular CLI
- Backend server running on localhost:3000

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Development Features

- **Test-Driven Development**: Comprehensive unit tests for all components and services
- **Type Safety**: Full TypeScript implementation with interfaces
- **Reactive Programming**: Uses RxJS observables and Angular signals
- **Modern Angular Patterns**: Standalone components, dependency injection, and modern Angular features

## UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Color Visualizations**: Color chips with actual color previews
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Hover effects and transitions

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── bear-form/
│   │   │   ├── bear-form.component.ts
│   │   │   ├── bear-form.component.html
│   │   │   ├── bear-form.component.scss
│   │   │   └── bear-form.component.spec.ts
│   │   └── bear-list/
│   │       ├── bear-list.component.ts
│   │       ├── bear-list.component.html
│   │       ├── bear-list.component.scss
│   │       └── bear-list.component.spec.ts
│   ├── models/
│   │   ├── bear.interface.ts
│   │   └── color.interface.ts
│   ├── services/
│   │   ├── bear.service.ts
│   │   ├── bear.service.spec.ts
│   │   ├── color.service.ts
│   │   └── color.service.spec.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.config.ts
```

## Testing Strategy

The application follows Test-Driven Development principles with:

- **Unit Tests**: For all services and components
- **Mock Services**: Proper mocking of HTTP calls and dependencies
- **Signal Testing**: Testing Angular signals and computed values
- **Form Testing**: Validation and user interaction testing
- **Error Handling**: Testing error scenarios and edge cases
