
import io
import re
import setuptools
import sys

with io.open('src/bbplay/server/__init__.py', encoding='utf8') as fp:
  version = re.search(r"__version__\s*=\s*'(.*)'", fp.read()).group(1)

long_description = None

requirements = ['flask >=1.1.1,<1.2.0', 'google-api-python-client >=1.7.11,<1.8.0', 'nr.commons >=0.1.0,<0.2.0', 'nr.databind >=0.1.0,<0.2.0', 'pony >=0.7.11,<0.8.0']

setuptools.setup(
  name = 'bbplay-server',
  version = version,
  author = 'Niklas Rosenstein',
  author_email = 'rosensteinniklas@gmail.com',
  description = 'Backend for the bbplay app.',
  long_description = long_description,
  long_description_content_type = 'text/plain',
  url = None,
  license = None,
  packages = setuptools.find_packages('src', ['test', 'test.*', 'docs', 'docs.*']),
  package_dir = {'': 'src'},
  include_package_data = False,
  install_requires = requirements,
  extras_require = {},
  tests_require = [],
  python_requires = None, # TODO: None,
  data_files = [],
  entry_points = {}
)
