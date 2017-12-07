function pluralize(n, singular, plural) {
  if (n === 1) {
    return singular;
  }
  return plural;
}

export default pluralize;
