# csTimer-Fork by David Rometsch

This is a fork of [cs0x7f/cstimer](https://github.com/cs0x7f/cstimer) extended with a **3BLD corner commutator scramble trainer**, developed as part of a Software Engineering project at TEKO Basel.

Added feature: 8 categories of 3BLD corner commutators + multi-cycle mode, selectable via the existing csTimer scramble UI.

📄 [Feature Documentation](documentation/Documentation.md)

---

# Running Locally

The `dist/` folder contains the pre-compiled application. A PHP built-in server is required.

```bash
cd dist
php -S localhost:8000
```

Then open [http://localhost:8000/timer.php](http://localhost:8000/timer.php) in your browser.

### After changing source files

If you modify anything in `src/`, recompile before running (requires Java):

```bash
make
```
