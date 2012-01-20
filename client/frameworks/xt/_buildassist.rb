# =====================================================================
# Build tool to detect loadable extensions for the SC Postbooks 4.0
# project. Assesses XBOs and Plugins and loads them according to their
# configuration.
# =====================================================================
def detect_modules

  puts ""
  puts "======== BEGIN XTBUILDASSISTANT ========"
  puts ""

  # a collection of deferred plugin/xbo
  deferred = []

  # a collection of inlined plugin/xbo
  inlined = []

  # a collection of any prefetched plugin/xbo
  prefetched = []

  # helper variable to indicate the full path to this file
  base_path = File.dirname(__FILE__) + "/"

  # directories to search through
  search_dirs = ["plugins", "xbos"]

  # for each of the search directories, iterate through their sub-
  # directories looking for XBOs and Plugins
  search_dirs.each do |search_dir|
    
    # we need the full path to the directory we're looking at
    sdp = base_path + search_dir + "/"
    
    # if it is NOT a directory, doesn't matter, don't care
    # also this validates the path is valid
    next unless FileTest.directory?(sdp)

    # since this is either `xbo` or `plugins` directory, we are
    # only concerned with subdirectories that might be loadables
    Dir.new(sdp).each do |loadable|
      
      # if it is one of the `.` or `..` OS level links, don't care
      next unless ![".", ".."].include?(loadable)

      # need to ensure this is also a directory
      # so we need the full path to this loadable
      lp = sdp + loadable + "/"

      # if it isn't a directory, don't care
      next unless FileTest.directory?(lp)

      # ensure that the potential loadable has a configuration file
      # this is one of the only ways we can be sure this is what it is
      # so first get a list of any files in the directory
      files = Dir.entries(lp)

      # now see if it is in there
      if !files.include?(".loadable")
        raise NoConfigurationFile, loadable
      end

      # let's see if we can grab a configuration file from the
      # potential loadable
      # (Loadable Configuration File Path...)
      lcfp = lp + ".loadable"

      # parse the file and allow the parser to add them to the
      # appropriate collection
      parse_configuration_file lcfp, deferred, inlined, prefetched, loadable

      # done with this loadable! 
    end # search directory paths loop
  end # search directories loop

  # now we need to generate the javascript to load along with foundation
  write_loadable_manifest deferred, inlined, prefetched, base_path
  
  puts ""
  puts "Deferred => " + deferred.join(", ")
  puts "Prefetched => " + prefetched.join(", ")
  puts "Inlined => " + inlined.join(", ")
  puts "See generated file (__loadable_manifest.js) in the system framework"
  puts ""
  puts "======== END XTBUILDASSISTANT ========"
  puts ""

  # now return the collections (which have been reformatted by
  # `write_loadable_manifest`!)
  return deferred, prefetched, inlined

end # detect modules function

# =====================================================================
# Parses a configuration file and appends it to the appropriate
# collection for later processing.
# =====================================================================
def parse_configuration_file(lcfp, d, i, p, n)
  
  # the open file descriptor
  # information as gathered from the configuration file
  parsed = Hash.new
 
  # try to open the file
  fd = File.open(lcfp)
 
  # iterate over the lines of key => value pairs with the
  # `:` separator
  fd.each_line do |line|
    next unless line.index(":") 
    parts = line.split(":")
    parsed[parts[0].strip] = parts[1].strip
  end # file-line iteration

  parsed['module'] = 'xt/' + n
 
  # we load them according to their requested `load` property
  case parsed["load"]
    when "deferred"
      d.push(parsed)
    when "inlined"
      i.push(parsed)
    when "prefetched"
      p.push(parsed)
    else
      raise NoLoadProperty, parsed["name"] || n
  end # case

  ensure
    fd.close

  # parsing complete
end # configuration parser function

# =====================================================================
# Generate the javascript loadable manifest for the foundation to load
# at runtime.
# =====================================================================
def write_loadable_manifest(deferred, prefetched, inlined, base_path)

  # we will collect the generated file's contents as an array
  # of sections to be dumped sequentially into the file at the end
  js = []

  # the effective path to the generated file
  file_path = base_path + "frameworks/foundation/__loadable_manifest.js" 

  # test to see if the file already exists
  begin; raise OverwriteLoadableManifest unless !File.exists?(file_path)
  rescue OverwriteLoadableManifest; puts "#{$!}"; end

  # header and footers are variables assigned at the bottom of this script
  # push the header of the file
  js.push(XTManifest::Header)

  # for each of the three collections, run them through their interpreters
  generate_deferred_entries js, deferred
  generate_prefetched_entries js, prefetched
  generate_inlined_entries js, inlined
  
  # push the footer of the file
  js.push(XTManifest::Footer)

  # go ahead and open the file for writing
  # this usage ensures the file closes by default
  File.open(file_path, "w") do |f|
    f.puts(js) 
  end

  # all done here
end # write the loadable manifest


# SPECIAL COMMENT =====================================================
# THESE HAVE BEEN SEPARATED FOR A REASON! WE NEED THE ABILITY TO DEAL
# WITH THEM DIFFERENTLY IN THE FUTURE EVEN THOUGH THEY LOOK DAMN NEAR
# IDENTICAL NOW. LEAVE THAT ALONE!
# =====================================================================


# =====================================================================
# Generate deferred Plugin/XBO entries for the manifest.
# =====================================================================
def generate_deferred_entries(js, collection)
  return unless collection.length > 0
  _collection = []
  js.push(XTManifest::DeferredComment)
  js.push(<<-eos)
  DEFERRED: [
  eos
  collection.each do |loadable|
    raise NoTypeProperty unless loadable["type"]
    raise NoNameProperty unless loadable["name"]
    js.push(<<-eos)
    {
    eos
    loadable.each_pair do |k,v|
      v = normalize_type v
      js.push(<<-eos)
      #{k}: #{v},
      eos
    end
    #   module: "xt/#{loadable['name'].downcase}"
    js.push(<<-eos)
    },
    eos
    _collection.push(loadable['module'].slice(3..-1))
  end
  js.push(<<-eos)
  ],
  eos
  collection.replace _collection
end

# =====================================================================
# Generate prefetched Plugin/XBO entries for the manifest.
# =====================================================================
def generate_prefetched_entries(js, collection)
  return unless collection.length > 0
  _collection = []
  js.push(XTManifest::PrefetchedComment)
  js.push(<<-eos)
  PREFETCHED: [
  eos
  collection.each do |loadable|
    raise NoTypeProperty unless loadable["type"]
    raise NoNameProperty unless loadable["name"]
    js.push(<<-eos)
    {
    eos
    loadable.each_pair do |k,v|
      v = normalize_type v
      js.push(<<-eos)
      #{k}: #{v},
      eos
    end
    #   module: "xt/#{loadable['name'].downcase}"
    js.push(<<-eos)
    },
    eos
    _collection.push(loadable['module'].slice(3..-1))
  end
  js.push(<<-eos)
  ],
  eos
  collection.replace _collection
end

# =====================================================================
# Generate inlined Plugin/XBO entries for the manifest.
# =====================================================================
def generate_inlined_entries(js, collection)
  return unless collection.length > 0
  _collection = []
  js.push(XTManifest::InlinedComment)
  js.push(<<-eos)
  INLINED: [
  eos
  collection.each do |loadable|
    raise NoTypeProperty unless loadable["type"]
    raise NoNameProperty unless loadable["name"]
    js.push(<<-eos)
    {
    eos
    loadable.each_pair do |k,v|
      v = normalize_type v
      js.push(<<-eos)
      #{k}: #{v},
      eos
    end
    #   module: "xt/#{loadable['name'].downcase}"
    js.push(<<-eos)
    },
    eos
    _collection.push(loadable['module'].slice(3..-1))
  end
  js.push(<<-eos)
  ],
  eos
  collection.replace _collection
end

# =====================================================================
# Try to determine what the data type is and what it should be when
# generating SC JavaScript code
# =====================================================================
def normalize_type(data)
  
  # everything interpreted from the file will be of type String in ruby
  # so we have to actually explicity look for certain things to be able
  # to determine what we need
  # this process does not nor should it be any type of true parser we
  # are only using this with entries for options we KNOW we support
  # and care about
  case data
    when /YES/i, /NO/i
      data = data.upcase
    when /\A(t|true)\z/i
      data = "YES"
    when /\A(f|false)\z/i
      data = "NO"
    
    # this is the default to wrap whatever it is in quotes so that it will
    # be interpreted as a string in JavaScript
    else
      data = "\"#{data}\""
  end
  return data
end

# =====================================================================
# Exception handling helpers.
# =====================================================================

class XTBuildException < Exception
  def to_s()
    return @err_str
  end
end

class NoConfigurationFile < XTBuildException
  def initialize(loadable)
    @err_str =<<-eos
Loadable `#{loadable}` found but no configuration file was present `.loadable`.
Please ensure Plugin's and XBOs have this file and are configured properly.
    eos
  end
end

class NoLoadProperty < XTBuildException
  def initialize(loadable)
    @err_str =<<-eos
Configuration file for loadable `#{loadable}` did not contain a `load` property
or the property was invalid. Possible values are `deferred`, `inlined` and `prefetched`.
Please configure plugin configuration files to include this property.
    eos
  end
end

class NoTypeProperty < XTBuildException
  def initialize()
    @err_str =<<-eos
Loadable's must define a `type` property to be able to be processed.
    eos
  end
end

class NoNameProperty < XTBuildException
  def initialize()
    @err_str =<<-eos
Loadable's must define a `name` property to be able to be processed.
    eos
  end
end

class OverwriteLoadableManifest < XTBuildException
  def initialize()
    @err_str =<<-eos

WARNING: The loadable manifest file being generated already exists, 
this is a warning that it will be overwritten with new content.

    eos
  end
end

module XTManifest
  Header =<<-eos
//============= BEGIN GENERATED CONTENT ==============
/** @note
  This file is automatically generated during the build process. Altering it will
  do nothing as it will be rewritten during the next build. Altering it during
  development will tell the development server (sc-server) to rebuilt it.
*/
XT.__LOADABLEINFO__ = {
  eos

  Footer =<<-eos
}; // end loadable info

//============= END GENERATED CONTENT ==============
  eos

  DeferredComment =<<-eos

  //== Deferred Plugins and XBOs ==
  eos

  InlinedComment =<<-eos

  //== Inlined Plugins and XBOs ==
  eos

  PrefetchedComment =<<-eos

  //== Prefetched Plugins and XBOs ==
  eos
end
