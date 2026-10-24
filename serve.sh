#!/bin/bash
# Preview the site locally at http://localhost:4000 (rebuilds when you save a file).
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
cd "$(dirname "$0")"
exec jekyll serve --livereload
