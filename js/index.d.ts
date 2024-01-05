/**
 * Typings for @gsoc2/cli
 */
declare module '@gsoc2/cli' {
  export interface Gsoc2CliOptions {
    /**
     * The URL of the Gsoc2 instance you are connecting to. Defaults to https://gsoc2.io/.
     * This value will update `GSOC2_URL env variable.
     */
    url?: string;
    /**
     * Authentication token for API, interchangeable with `apiKey`.
     * This value will update `GSOC2_AUTH_TOKEN` env variable.
     */
    authToken?: string;
    /**
     * Authentication token for API, interchangeable with `authToken`.
     * This value will update `GSOC2_API_KEY` env variable.
     */
    apiKey?: string;
    /**
     * Gsoc2 DSN.
     * This value will update `GSOC2_DSN` env variable.
     */
    dsn?: string;
    /**
     * Organization slug.
     * This value will update `GSOC2_ORG` env variable.
     */
    org?: string;
    /**
     * Project Project slug.
     * This value will update `GSOC2_PROJECT` env variable.
     */
    project?: string;
    /**
     * Version control system remote name.
     * This value will update `GSOC2_VCS_REMOTE` env variable.
     */
    vcsRemote?: string;
    /**
     * If true, all logs are suppressed.
     */
    silent?: boolean;
    /**
     * A header added to every outgoing network request.
     * This value will update `CUSTOM_HEADER` env variable.
     */
    customHeader?: string;
    /**
     * Headers added to every outgoing network request.
     * This value does not set any env variable, and is overridden by `customHeader`.
     */
    headers?: Record<string, string>;
  }

  /**
   * Custom upload-sourcemaps options for a particular `include` path. In this
   * case `paths` takes the place of `include` in the options so as to make it
   * clear that this is not recursive.
   */
  export type SourceMapsPathDescriptor = Omit<Gsoc2CliUploadSourceMapsOptions, 'include'> & {
    paths: string[];
  };

  export interface Gsoc2CliUploadSourceMapsOptions {
    /**
     * One or more paths that Gsoc2 CLI should scan recursively for sources.
     * It will upload all .map files and match associated .js files.
     */
    include: Array<string | SourceMapsPathDescriptor>;
    /**
     * One or more paths to ignore during upload. Overrides entries in ignoreFile file.
     */
    ignore?: string[];
    /**
     * Path to a file containing list of files/directories to ignore.
     * Can point to .gitignore or anything with same format.
     */
    ignoreFile?: string | null;
    /**
     * Enables rewriting of matching sourcemaps so that indexed maps are flattened
     * and missing sources are inlined if possible. Defaults to `true`.
     */
    rewrite?: boolean;
    /**
     * This prevents the automatic detection of sourcemap references.
     */
    sourceMapReference?: boolean;
    /**
     * Enables files gzip decompression prior to uploading. Defaults to `false`.
     */
    decompress?: boolean;
    /**
     * Enable artifacts deduplication prior to uploading. This will skip uploading
     * any artifacts that are already present on the server. Defaults to `true`.
     */
    dedupe?: boolean;
    /**
     * When paired with the rewrite option this will remove a prefix from uploaded files.
     * For instance you can use this to remove a path that is build machine specific.
     */
    stripPrefix?: string[];
    /**
     * When paired with the rewrite option this will add ~ to the stripPrefix array.
     */
    stripCommonPrefix?: boolean;
    /**
     * This attempts sourcemap validation before upload when rewriting is not enabled.
     * It will spot a variety of issues with source maps and cancel the upload if any are found.
     * This is not enabled by default as this can cause false positives.
     */
    validate?: boolean;
    /**
     * This sets an URL prefix at the beginning of all files.
     * This defaults to `~/` but you might want to set this to the full URL.
     * This is also useful if your files are stored in a sub folder. eg: url-prefix `~/static/js`.
     */
    urlPrefix?: string;
    /**
     * This sets an URL suffix at the end of all files.
     * Useful for appending query parameters.
     */
    urlSuffix?: string;
    /**
     * This sets the file extensions to be considered.
     * By default the following file extensions are processed: js, map, jsbundle and bundle.
     */
    ext?: string[];
    /**
     * Unique identifier for the distribution, used to further segment your release.
     * Usually your build number.
     */
    dist?: string;
    /**
     * Use new Artifact Bundles upload, that enables use of Debug ID for Source Maps discovery.
     */
    useArtifactBundle?: boolean;
  }

  export interface Gsoc2CliNewDeployOptions {
    /**
     * Environment for this release. Values that make sense here would be `production` or `staging`.
     */
    env: string;
    /**
     * Deployment start time in Unix timestamp (in seconds) or ISO 8601 format.
     */
    started?: number | string;
    /**
     * Deployment finish time in Unix timestamp (in seconds) or ISO 8601 format.
     */
    finished?: number | string;
    /**
     * Deployment duration (in seconds). Can be used instead of started and finished.
     */
    time?: number;
    /**
     * Human readable name for the deployment.
     */
    name?: string;
    /**
     * URL that points to the deployment.
     */
    url?: string;
  }

  export interface Gsoc2CliCommitsOptions {
    /**
     * Automatically choose the associated commit (uses the current commit). Overrides other setCommit options.
     */
    auto?: boolean;
    /**
     * The full repo name as defined in Gsoc2. Required if auto option is not true.
     */
    repo?: string;
    /**
     * The current (last) commit in the release. Required if auto option is not true.
     */
    commit?: string;
    /**
     * The commit before the beginning of this release (in other words, the last commit of the previous release).
     * If omitted, this will default to the last commit of the previous release in Gsoc2.
     * If there was no previous release, the last 10 commits will be used.
     */
    previousCommit?: string;
    /**
     * When the flag is set and the previous release commit was not found in the repository, will create a release
     * with the default commits count(or the one specified with `--initial-depth`) instead of failing the command.
     */
    ignoreMissing?: boolean;
    /**
     * When the flag is set, command will not fail and just exit silently if no new commits for a given release have been found.
     */
    ignoreEmpty?: boolean;
  }

  export interface Gsoc2CliReleases {
    ['new'](release: string, options?: { projects: string[] } | string[]): Promise<string>;

    setCommits(release: string, options: Gsoc2CliCommitsOptions): Promise<string>;

    finalize(release: string): Promise<string>;

    proposeVersion(): Promise<string>;

    uploadSourceMaps(release: string, options: Gsoc2CliUploadSourceMapsOptions): Promise<string>;

    listDeploys(release: string): Promise<string>;

    newDeploy(release: string, options: Gsoc2CliNewDeployOptions): Promise<string>;

    execute(args: string[], live: boolean): Promise<string>;
  }

  export default class Gsoc2Cli {
    /**
     * Creates a new instance of Gsoc2Cli class
     *
     * @param configFile Path to Gsoc2 CLI config properties, as described in https://docs.gsoc2.io/learn/cli/configuration/#properties-files.
     * By default, the config file is looked for upwards from the current path and defaults from ~/.gsoc2clirc are always loaded.
     * This value will update `GSOC2_PROPERTIES` env variable.
     * @param options {@link Gsoc2CliOptions}
     */
    constructor(configFile?: string | null, options?: Gsoc2CliOptions);

    public configFile?: string;
    public options?: Gsoc2CliOptions;
    public releases: Gsoc2CliReleases;

    public static getVersion(): string;
    public static getPath(): string;
    public execute(args: string[], live: boolean): Promise<string>;
  }
}