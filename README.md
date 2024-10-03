## Branching Strategy

Our project follows a structured branching strategy to ensure stability, collaboration, and smooth feature integration. Below are the main guidelines:

### Main Branch (`main`)
- The `main` branch is our production-ready code.
- It contains the latest stable version of the project.
- No direct commits are allowed. All changes must come through pull requests (PRs) after being reviewed and approved.
  
### Feature Branches (`feature/*`)
- For each new feature, a separate branch is created.
- Naming convention: `feature/feature-name` (e.g., `feature/chatcat-ui`).
- Work is done on this branch independently before it is merged into `main` via a pull request.

### Development Branch (`dev`)
- The `dev` branch is used for integrating multiple features for testing before merging them into `main`.
- Feature branches are merged into `dev` to test integration and run automated tests.

### Personal Branches (`team-member-name/*`)
- Each team member has their own personal branch for testing, prototyping, or working on small fixes.
- Naming convention: `team-member-name/personal-branch` (e.g., `billy-joel/new-approach`).
- Personal branches can be used to develop, experiment, or work on non-critical changes before creating a feature branch or merging to `dev`.

### Pull Requests and Code Review
- All changes must be submitted via pull requests.
- At least one reviewer must approve the pull request before merging.
- Automated tests must pass before a pull request is merged.

### Branch Protection Rules
- The `main` branch is protected to prevent direct commits.
- All commits must be made through approved pull requests.
