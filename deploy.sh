# stash changes/files in case the prior deployment generated files not in version control
echo "stashing changes since last deployment ..."
sleep 1.5
git stash

# remove the generated site/deployment directory
echo "removing _site directory ..."
sleep 1.5
rm -r -f _site

echo "starting static site generation ..."
sleep 1.5
npx @11ty/eleventy

echo "DONE!"