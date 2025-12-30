# Contribution Guidelines

Thank you for your interest in contributing to **Campus Academic Resource Sharing Platform**!

This document applies to contributions for **both the frontend ([React/Vite](./README.md)) and backend ([Go API](../backend/README.md) or relevant backend docs)** repositories. Our community welcomes your ideas, fixes, new features, and improvements. Please take a moment to review these guidelines before opening an issue or submitting a pull request.

---

## 📄 License

**This project is licensed under the [GNU General Public License v3.0 (GPLv3)](./LICENSE).**  
By contributing, you agree that your work will also be distributed under the GPLv3 license.

- Ensure any third-party code or dependencies you add are compatible with the GPLv3.
- Be mindful of copyright and attribution for any reused code.

---

## 📂 Project Structure

The project consists of at least two main components:

### Frontend (`campus-share-frontend`)
A feature-oriented React application built with Vite.


### Backend (`campus-share-backend` or `/backend`)
A Go (Golang) API server providing authentication, resource management, and file storage logic.  

---

## ✍️ How to Contribute

1. **Fork the repository**  
   Use GitHub's "Fork" button to create your own copy.

2. **Clone your fork**
   ```bash
   git clone https://github.com/<afomia-01>/Campus-Share.git
   cd Campus-Share
   ```

3. **Set up prerequisites**  
   - **Frontend:** Requires [Node.js v18+](https://nodejs.org/) and npm.
   - **Backend:** Requires [Go](https://golang.org/) (see backend README for any specific version or environment).
   - Review and follow environment setup instructions in the respective `README.md`.

4. **Create a new branch**
   ```bash
   git checkout -b feature/<name>    # For new features or enhancements
   git checkout -b fix/<name>        # For fixes
   ```

5. **Implement and Test**
   - Follow project conventions (see [Project Structure](#project-structure)).
   - For **frontend**: Keep UI logic and reusable components in `src/components/`; business logic in `src/features/`.
   - For **backend**: Organize routes, handlers, and models per feature/module.
   - Add or update tests/documentation if necessary.
   - Run tests and verify your changes work locally for both frontend and backend.

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat(frontend|backend): short description"
   git push origin <your-branch>
   ```

7. **Open a Pull Request**
   - Submit your branch as a Pull Request to the main repository.
   - Provide a clear title and detailed description.
   - Reference relevant Issues if applicable (e.g., `Closes #42`).

---

## 🤝 Code of Conduct

Please treat everyone respectfully. Discussions and disagreements are healthy, but toxicity is not tolerated.

---

## 🛠️ Best Practices

- Keep changes focused and atomic (small, single-purpose PRs are easier to review and merge).
- Use clear, conventional commit messages (e.g., `fix(auth): correct JWT expiration bug`).
- If you add new dependencies, explain their necessity in your PR.
- Update documentation and tests as needed.
- For major changes or controversial ideas, open an issue for discussion before the PR.

---

## 📚 Further Resources

- [GNU GPLv3 License](https://www.gnu.org/licenses/gpl-3.0.html)
- [Frontend README](./README.md)
- [Backend README](../backend/README.md) 
---

**Thank you for helping to make Campus Academic Resource Sharing Platform better! Your contributions are valued and appreciated. 🚀**

```
