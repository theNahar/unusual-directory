# Contributing to Directory App

Thank you for your interest in contributing to our Directory App! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📋 To-Do List

- change the screenshot image to be .png
- Promotion system
- 

### 🎯 High Priority
- [ ] **Dark/Light Mode Toggle**
  - [ ] Add toggle button in header
  - [ ] Implement theme switching logic
  - [ ] Add theme persistence
  - [ ] Test on all pages

- [ ] **Advanced Search Implementation**
  - [ ] Search within descriptions
  - [ ] Search within tags
  - [ ] Add search filters (category, date, status)
  - [ ] Implement search suggestions
  - [ ] Add search history

- [ ] **Mobile Responsiveness Improvements**
  - [ ] Optimize admin panel for mobile
  - [ ] Improve bookmark card layout on small screens
  - [ ] Add touch-friendly interactions
  - [ ] Test on various mobile devices

### 🔧 Medium Priority
- [ ] **Bookmark Statistics Dashboard**
  - [ ] Add view count tracking
  - [ ] Create statistics page in admin
  - [ ] Show most popular bookmarks
  - [ ] Add recently added bookmarks section
  - [ ] Implement analytics charts

- [ ] **Bulk Operations**
  - [ ] Bulk import bookmarks (CSV/JSON)
  - [ ] Bulk export bookmarks
  - [ ] Bulk edit functionality
  - [ ] Bulk delete with confirmation

- [ ] **Enhanced Admin Features**
  - [ ] User management (multiple admins)
  - [ ] Audit log for changes
  - [ ] Admin activity dashboard
  - [ ] Backup/restore functionality

### 🌟 Nice to Have
- [ ] **Browser Extension**
  - [ ] Chrome extension for saving bookmarks
  - [ ] Firefox extension
  - [ ] One-click bookmark saving
  - [ ] Sync with main app

- [ ] **API Development**
  - [ ] RESTful API endpoints
  - [ ] API authentication
  - [ ] Rate limiting
  - [ ] API documentation

- [ ] **Social Features**
  - [ ] Social media sharing
  - [ ] Public bookmark collections
  - [ ] User comments/ratings
  - [ ] Community features

- [ ] **Performance Optimizations**
  - [ ] Implement caching strategies
  - [ ] Optimize database queries
  - [ ] Add CDN support
  - [ ] Image optimization

### 🐛 Bug Fixes
- [ ] **Known Issues**
  - [ ] Fix any reported bugs
  - [ ] Improve error handling
  - [ ] Add better error messages
  - [ ] Performance improvements

### 📚 Documentation
- [ ] **Code Documentation**
  - [ ] Add JSDoc comments
  - [ ] Update README.md
  - [ ] Create API documentation
  - [ ] Add setup guides

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Turso database account
- Environment variables configured

### Installation
```bash
# Clone the repository
git clone https://github.com/theNahar/directory-app.git
cd directory-app

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up your environment variables in .env
# (See README.md for required variables)

# Run database migrations
pnpm run db:migrate

# Start development server
pnpm run dev
```

## 🧪 Testing

Before submitting a pull request, please ensure:

- [ ] All existing tests pass
- [ ] New features have appropriate tests
- [ ] Code follows the project's style guidelines
- [ ] No console errors or warnings
- [ ] Mobile responsiveness is maintained

## 📝 Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device information
6. **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting new features:

1. **Clear Description**: What the feature should do
2. **Use Case**: Why this feature is needed
3. **Mockups**: Visual examples if applicable
4. **Priority**: High/Medium/Low priority level

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

## 🤝 Questions?

If you have any questions about contributing, please:

1. Check the existing issues and discussions
2. Create a new issue with the "question" label
3. Reach out to the maintainers

---

**Thank you for contributing! 🎉**
