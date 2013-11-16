# Installation

1. Put in your Gemfile

```
gem 'refinerycms-tinymce', '~> 0.0.1', github: 'keram/refinerycms-tinymce'
```

2. ``$ bundle install``

3. ``$ rails generate refinery:tinymce``

4. Download latest tinymce editor from http://tinymce.com/
  and unpack it in ``public/components/`` directory.

5. If you want use editor from CDN or from other directory than ``public/components/tinymce/``
  set option ``tinymce_url`` in ``config/initializers/refinery/tinymce.rb`` to your location.

# Requirements

todo

## Development

todo

## TODO

Point 4 of installation replace with installation tinymce via bower.
