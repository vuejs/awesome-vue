'use strict';
const Generator = require('yeoman-generator');

const licenses = [
  { name: 'Apache 2.0', value: 'Apache-2.0' },
  { name: 'MIT', value: 'MIT' },
  { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
  { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
  { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
  { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
  { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
  { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
  { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
  { name: 'Unlicense', value: 'unlicense' },
  { name: 'No License (Copyrighted)', value: 'UNLICENSED' }
];

module.exports = class GeneratorLicense extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('name', {
      type: String,
      desc: 'Name of the license owner',
      required: false
    });

    this.option('email', {
      type: String,
      desc: 'Email of the license owner',
      required: false
    });

    this.option('website', {
      type: String,
      desc: 'Website of the license owner',
      required: false
    });

    this.option('year', {
      type: String,
      desc: 'Year(s) to include on the license',
      required: false,
      defaults: new Date().getFullYear()
    });

    this.option('licensePrompt', {
      type: String,
      desc: 'License prompt text',
      defaults: 'Which license do you want to use?',
      hide: true,
      required: false
    });

    this.option('defaultLicense', {
      type: String,
      desc: 'Default license',
      required: false
    });

    this.option('license', {
      type: String,
      desc:
        'Select a license, so no license prompt will happen, in case you want to handle it outside of this generator',
      required: false
    });

    this.option('output', {
      type: String,
      desc: 'Set the output file for the generated license',
      required: false,
      defaults: 'LICENSE'
    });

    this.option('publish', {
      type: Boolean,
      desc: 'Publish the package',
      required: false
    });
  }

  initializing() {
    this.gitc = {
      user: {
        name: this.user.git.name(),
        email: this.user.git.email()
      }
    };
  }

  prompting() {
    const prompts = [
      {
        name: 'name',
        message: "What's your name:",
        default: this.options.name || this.gitc.user.name,
        when: this.options.name === undefined
      },
      {
        name: 'email',
        message: 'Your email (optional):',
        default: this.options.email || this.gitc.user.email,
        when: this.options.email === undefined
      },
      {
        name: 'website',
        message: 'Your website (optional):',
        default: this.options.website,
        when: this.options.website === undefined
      },
      {
        type: 'list',
        name: 'license',
        message: this.options.licensePrompt,
        default: this.options.defaultLicense,
        when:
          !this.options.license ||
          licenses.find(x => x.value === this.options.license) === undefined,
        choices: licenses
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign(
        {
          name: this.options.name,
          email: this.options.email,
          website: this.options.website,
          license: this.options.license
        },
        props
      );
    });
  }

  writing() {
    // License file
    const filename = this.props.license + '.txt';
    let author = this.props.name.trim();
    if (this.props.email) {
      author += ' <' + this.props.email.trim() + '>';
    }
    if (this.props.website) {
      author += ' (' + this.props.website.trim() + ')';
    }

    this.fs.copyTpl(
      this.templatePath(filename),
      this.destinationPath(this.options.output),
      {
        year: this.options.year,
        author: author
      }
    );

    // Package
    if (!this.fs.exists(this.destinationPath('package.json'))) {
      return;
    }

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    pkg.license = this.props.license;

    if (
      (this.options.publish === undefined && this.props.license === 'UNLICENSED') ||
      this.options.publish === false
    ) {
      delete pkg.license;
      pkg.private = true;
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};

module.exports.licenses = licenses;
