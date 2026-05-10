-- Policy upload
create policy "Allow upload tutorial images"
on storage.objects
for insert
to public
with check (
  bucket_id = 'tutorial-images'
);

-- Policy baca file
create policy "Allow read tutorial images"
on storage.objects
for select
to public
using (
  bucket_id = 'tutorial-images'
);

-- Policy update file
create policy "Allow update tutorial images"
on storage.objects
for update
to public
using (
  bucket_id = 'tutorial-images'
);

-- Policy delete file
create policy "Allow delete tutorial images"
on storage.objects
for delete
to public
using (
  bucket_id = 'tutorial-images'
);